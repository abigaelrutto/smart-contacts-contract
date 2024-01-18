# Smart Contacts Contract

This project involves creating a decentralized contact management system on the Internet Computer using smart contracts developed in Typescript. Users can add, update, and delete contacts, and contact details are securely stored on the Smart Contract. Blockchain-based identity is used for secure authentication.

## Overview

Here's an overview of its key components:

### 1. Type Definitions

- **Contact Type:**

  ```typescript
  type Contact = Record<{
    id: string;
    name: string;
    number: number;
    address: string;
    company: string;
    label: string;
    info: string;
    updated_at: Opt<nat64>;
    created_date: nat64;
  }>;
  ```

- **ContactPayload Type:**

  ```typescript
  type ContactPayload = Record<{
    name: string;
    number: number;
    address: string;
    company: string;
    label: string;
    info: string;
  }>;
  ```

### 2. Storage

- A stable BTree map (`contactStorage`) is used to store contacts.

  ```typescript
  const contactStorage = new StableBTreeMap<string, Contact>(0, 44, 512);
  ```

### 3. Update Functions

- Update functions modify the state. For example:

  ```typescript
  @update
  function addContact(payload: ContactPayload): Result<Contact, string> { /* ... */ }
  ```

### 4. Query Functions

- Query functions retrieve data but don't modify the state:

  ```typescript
  @query
  function getContact(id: string): Result<Contact, string> { /* ... */ }

  @query
  function getAllContacts(): Result<Vec<Contact>, string> { /* ... */ }

  @query
  function searchContactsByName(name: string): Result<Vec<Contact>, string> { /* ... */ }

  @query
  function searchContactsByCompany(company: string): Result<Vec<Contact>, string> { /* ... */ }

  @query
  function searchContactsByLabel(label: string): Result<Vec<Contact>, string> { /* ... */ }

  @query
  function searchContactsByAddress(address: string): Result<Vec<Contact>, string> { /* ... */ }

  @query
  function searchContactsByPhoneNumber(number: number): Result<Vec<Contact>, string> { /* ... */ }
  ```

### 5. Update and Delete Functions

- Functions are provided to update and delete contacts:

  ```typescript
  @update
  function updateContact(id: string, payload: ContactPayload): Result<Contact, string> { /* ... */ }

  @update
  function deleteContact(id: string): Result<Contact, string> { /* ... */ }
  ```

### 6. UUID Generation

- A workaround for generating UUIDs using the `uuid` library:

  ```typescript
  globalThis.crypto = {
    getRandomValues: () => {
      let array = new Uint8Array(32);

      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }

      return array;
    },
  };
  ```

### 7. Error Handling

- The `Result` type is used for handling errors and successful results.

### 8. Validation

- Input data is validated, and functions return an error if required fields are missing.
