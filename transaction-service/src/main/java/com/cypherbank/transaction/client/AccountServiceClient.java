package com.cypherbank.transaction.client;

import com.cypherbank.transaction.model.Account;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@FeignClient(name = "account-service")
public interface AccountServiceClient {
    @GetMapping("/api/accounts/{id}")
    Optional<Account> getAccountById(@PathVariable("id") Long id);
    
    @GetMapping("/api/accounts/user/{userId}")
    List<Account> getAccountsByUserId(@PathVariable("userId") Long userId);
}

