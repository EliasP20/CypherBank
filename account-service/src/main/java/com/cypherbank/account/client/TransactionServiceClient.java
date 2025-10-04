package com.cypherbank.account.client;

import com.cypherbank.account.model.Transaction;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "transaction-service")
public interface TransactionServiceClient {
    
    @PostMapping("/api/transactions")
    Transaction createTransaction(@RequestBody Transaction transaction);
}


