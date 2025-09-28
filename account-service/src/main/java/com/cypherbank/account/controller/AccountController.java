package com.cypherbank.account.controller;

import com.cypherbank.account.model.Account;
import com.cypherbank.account.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable("id") Long id) {
        Optional<Account> account = accountService.getAccountById(id);
        return account.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Account>> getAccountsByUserId(@PathVariable("userId") Long userId) {
        System.out.println("AccountController: Fetching accounts for userId: " + userId);
        List<Account> accounts = accountService.getAccountsByUserId(userId);
        System.out.println("AccountController: Found " + accounts.size() + " accounts for user " + userId);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestParam("userId") Long userId, 
                                                @RequestParam("type") String type,
                                                @RequestParam("initialBalance") BigDecimal initialBalance) {
        try {
            System.out.println("AccountController: Creating account - userId: " + userId + ", type: " + type + ", balance: " + initialBalance);
            Account account = accountService.createAccount(userId, type, initialBalance);
            System.out.println("AccountController: Account created successfully with id: " + account.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(account);
        } catch (RuntimeException e) {
            System.out.println("AccountController: Error creating account: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/balance")
    public ResponseEntity<Account> updateAccountBalance(@PathVariable("id") Long id, 
                                                       @RequestParam("newBalance") BigDecimal newBalance) {
        try {
            Account account = accountService.updateAccountBalance(id, newBalance);
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable("id") Long id, @RequestParam("amount") BigDecimal amount) {
        try {
            accountService.deposit(id, amount);
            Optional<Account> account = accountService.getAccountById(id);
            return account.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable("id") Long id, @RequestParam("amount") BigDecimal amount) {
        try {
            boolean success = accountService.withdraw(id, amount);
            if (success) {
                Optional<Account> account = accountService.getAccountById(id);
                return account.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
            } else {
                return ResponseEntity.badRequest().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<String> transferBetweenAccounts(@RequestParam("fromAccountId") Long fromAccountId, 
                                                         @RequestParam("toAccountId") Long toAccountId, 
                                                         @RequestParam("amount") BigDecimal amount) {
        try {
            boolean success = accountService.transferBetweenAccounts(fromAccountId, toAccountId, amount);
            if (success) {
                return ResponseEntity.ok("Transfer successful");
            } else {
                return ResponseEntity.badRequest().body("Transfer failed");
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Transfer failed: " + e.getMessage());
        }
    }
}

