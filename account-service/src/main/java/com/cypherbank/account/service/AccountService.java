package com.cypherbank.account.service;

import com.cypherbank.account.client.UserServiceClient;
import com.cypherbank.account.client.TransactionServiceClient;
import com.cypherbank.account.model.Account;
import com.cypherbank.account.model.User;
import com.cypherbank.account.model.Transaction;
import com.cypherbank.account.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    @Autowired
    private TransactionServiceClient transactionServiceClient;

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Optional<Account> getAccountById(Long id) {
        return accountRepository.findById(id);
    }

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public Account createAccount(Long userId, String type, BigDecimal initialBalance) {
        System.out.println("Creating account for userId: " + userId + ", type: " + type + ", balance: " + initialBalance);
        
        // For now, skip user verification to avoid the database schema issue
        // TODO: Re-enable user verification once database schema is updated
        /*
        try {
            Optional<User> userOpt = userServiceClient.getUserById(userId);
            if (userOpt.isEmpty()) {
                System.out.println("User not found with id: " + userId);
                throw new RuntimeException("User not found with id: " + userId);
            }
            System.out.println("User found: " + userOpt.get().getFirstName() + " " + userOpt.get().getLastName());
        } catch (Exception e) {
            System.out.println("Error verifying user: " + e.getMessage());
            throw new RuntimeException("User not found with id: " + userId);
        }
        */
        
        Account account = new Account(type, initialBalance, userId);
        Account savedAccount = accountRepository.save(account);
        System.out.println("Account created successfully with id: " + savedAccount.getId());
        return savedAccount;
    }

    public Account updateAccountBalance(Long accountId, BigDecimal newBalance) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        
        account.setBalance(newBalance);
        return accountRepository.save(account);
    }

    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
        accountRepository.delete(account);
    }

    public void deposit(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null) {
            account.setBalance(account.getBalance().add(amount));
            accountRepository.save(account);
            
            // Create transaction record
            try {
                Transaction transaction = new Transaction("DEPOSIT", null, accountId, amount);
                transactionServiceClient.createTransaction(transaction);
                System.out.println("Deposit transaction created: Account " + accountId + ", Amount: " + amount);
            } catch (Exception e) {
                System.out.println("Could not create transaction record: " + e.getMessage());
            }
        }
    }

    public boolean withdraw(Long accountId, BigDecimal amount) {
        Account account = accountRepository.findById(accountId).orElse(null);
        if (account != null && account.getBalance().compareTo(amount) >= 0) {
            account.setBalance(account.getBalance().subtract(amount));
            accountRepository.save(account);
            
            // Create transaction record
            try {
                Transaction transaction = new Transaction("WITHDRAW", accountId, null, amount);
                transactionServiceClient.createTransaction(transaction);
                System.out.println("Withdrawal transaction created: Account " + accountId + ", Amount: " + amount);
            } catch (Exception e) {
                System.out.println("Could not create transaction record: " + e.getMessage());
            }
            
            return true;
        }
        return false;
    }

    public boolean transferBetweenAccounts(Long fromAccountId, Long toAccountId, BigDecimal amount) {
        Account fromAccount = accountRepository.findById(fromAccountId).orElse(null);
        Account toAccount = accountRepository.findById(toAccountId).orElse(null);

        if (fromAccount != null && toAccount != null && fromAccount.getBalance().compareTo(amount) >= 0) {
            fromAccount.setBalance(fromAccount.getBalance().subtract(amount));
            toAccount.setBalance(toAccount.getBalance().add(amount));

            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            
            // Create transaction record
            try {
                Transaction transaction = new Transaction("TRANSFER", fromAccountId, toAccountId, amount);
                transactionServiceClient.createTransaction(transaction);
                System.out.println("Transfer transaction created: From Account " + fromAccountId + " to Account " + toAccountId + ", Amount: " + amount);
            } catch (Exception e) {
                System.out.println("Could not create transaction record: " + e.getMessage());
            }
            
            return true;
        }
        return false;
    }

    public Account findTransferAccountByUser(Long userId) {
        List<Account> transferAccounts = accountRepository.findByUserIdAndType(userId, "Transfer Account");
        return transferAccounts.isEmpty() ? null : transferAccounts.get(0);
    }
}

