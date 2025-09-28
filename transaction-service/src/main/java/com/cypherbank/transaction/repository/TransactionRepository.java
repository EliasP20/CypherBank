package com.cypherbank.transaction.repository;

import com.cypherbank.transaction.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountId(Long fromAccountId);
    List<Transaction> findByToAccountId(Long toAccountId);
    List<Transaction> findByFromAccountIdOrToAccountId(Long fromAccountId, Long toAccountId);
    List<Transaction> findByFromAccountIdInOrToAccountIdIn(List<Long> fromAccountIds, List<Long> toAccountIds);
}

