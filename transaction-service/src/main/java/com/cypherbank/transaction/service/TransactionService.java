package com.cypherbank.transaction.service;

import com.cypherbank.transaction.client.AccountServiceClient;
import com.cypherbank.transaction.client.UserServiceClient;
import com.cypherbank.transaction.dto.TransactionDTO;
import com.cypherbank.transaction.model.Account;
import com.cypherbank.transaction.model.Transaction;
import com.cypherbank.transaction.model.User;
import com.cypherbank.transaction.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountServiceClient accountServiceClient;

    @Autowired
    private UserServiceClient userServiceClient;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionsByUserId(Long userId) {
        // Get all accounts for this user first
        List<Account> userAccounts = accountServiceClient.getAccountsByUserId(userId);
        List<Long> accountIds = userAccounts.stream().map(Account::getId).collect(Collectors.toList());
        
        // Find all transactions involving any of the user's accounts
        return transactionRepository.findByFromAccountIdInOrToAccountIdIn(accountIds, accountIds);
    }

    public List<TransactionDTO> getTransactionsByUserIdWithEmails(Long userId) {
        // Get all accounts for this user first
        List<Account> userAccounts = accountServiceClient.getAccountsByUserId(userId);
        List<Long> accountIds = userAccounts.stream().map(Account::getId).collect(Collectors.toList());
        
        // Find all transactions involving any of the user's accounts
        List<Transaction> transactions = transactionRepository.findByFromAccountIdInOrToAccountIdIn(accountIds, accountIds);
        
        return transactions.stream().map(transaction -> {
            String fromUserEmail = null;
            String toUserEmail = null;

            if (transaction.getFromAccountId() != null) {
                Optional<Account> fromAccountOpt = accountServiceClient.getAccountById(transaction.getFromAccountId());
                if (fromAccountOpt.isPresent()) {
                    Account fromAccount = fromAccountOpt.get();
                    Optional<User> fromUserOpt = userServiceClient.getUserById(fromAccount.getUserId());
                    if (fromUserOpt.isPresent()) {
                        fromUserEmail = fromUserOpt.get().getEmail();
                    }
                }
            }

            if (transaction.getToAccountId() != null) {
                Optional<Account> toAccountOpt = accountServiceClient.getAccountById(transaction.getToAccountId());
                if (toAccountOpt.isPresent()) {
                    Account toAccount = toAccountOpt.get();
                    Optional<User> toUserOpt = userServiceClient.getUserById(toAccount.getUserId());
                    if (toUserOpt.isPresent()) {
                        toUserEmail = toUserOpt.get().getEmail();
                    }
                }
            }

            return new TransactionDTO(
                    transaction.getId(),
                    transaction.getType(),
                    transaction.getAmount(),
                    fromUserEmail,
                    toUserEmail,
                    transaction.getTimestamp()
            );
        }).collect(Collectors.toList());
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction modifyTransaction(Transaction transaction) {
        Transaction original = transactionRepository.findById(transaction.getId())
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + transaction.getId()));

        original.setToAccountId(transaction.getToAccountId());
        original.setType(transaction.getType());
        original.setAmount(transaction.getAmount());
        original.setFromAccountId(transaction.getFromAccountId());
        original.setTimestamp(transaction.getTimestamp());

        return saveTransaction(original);
    }

    public void deleteTransactionById(Long id) {
        transactionRepository.deleteById(id);
    }

    public List<TransactionDTO> getTransactionHistory(Long accountId) {
        Optional<Account> accountOpt = accountServiceClient.getAccountById(accountId);
        if (accountOpt.isEmpty()) return List.of();

        List<Transaction> transactions = transactionRepository.findByFromAccountIdOrToAccountId(accountId, accountId);

        return transactions.stream().map(transaction -> {
            String fromUserEmail = null;
            String toUserEmail = null;

            if (transaction.getFromAccountId() != null) {
                Optional<Account> fromAccountOpt = accountServiceClient.getAccountById(transaction.getFromAccountId());
                if (fromAccountOpt.isPresent()) {
                    Account fromAccount = fromAccountOpt.get();
                    Optional<User> fromUserOpt = userServiceClient.getUserById(fromAccount.getUserId());
                    if (fromUserOpt.isPresent()) {
                        fromUserEmail = fromUserOpt.get().getEmail();
                    }
                }
            }

            if (transaction.getToAccountId() != null) {
                Optional<Account> toAccountOpt = accountServiceClient.getAccountById(transaction.getToAccountId());
                if (toAccountOpt.isPresent()) {
                    Account toAccount = toAccountOpt.get();
                    Optional<User> toUserOpt = userServiceClient.getUserById(toAccount.getUserId());
                    if (toUserOpt.isPresent()) {
                        toUserEmail = toUserOpt.get().getEmail();
                    }
                }
            }

            return new TransactionDTO(
                    transaction.getId(),
                    transaction.getType(),
                    transaction.getAmount(),
                    fromUserEmail,
                    toUserEmail,
                    transaction.getTimestamp()
            );
        }).collect(Collectors.toList());
    }
}

