import {
  $query,
  $update,
  Record,
  StableBTreeMap,
  Vec,
  match,
  Result,
  nat64,
  ic,
  Opt,
} from "azle";
import { v4 as uuidv4 } from "uuid";

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

type ContactPayload = Record<{
  name: string;
  number: number;
  address: string;
  company: string;
  label: string;
  info: string;
}>;

const contactStorage = new StableBTreeMap<string, Contact>(0, 44, 512);

// add contact
$update;
export function addContact(payload: ContactPayload): Result<Contact, string> {
  // Validate input
  if (
    !payload.name ||
    !payload.number ||
    !payload.address ||
    !payload.company ||
    !payload.label ||
    !payload.info
  ) {
    return Result.Err<Contact, string>("Missing some fields in input data");
  }

  try {
    const contact = {
      id: uuidv4(),
      updated_at: Opt.None,
      created_date: ic.time(),
      ...payload,
    };

    contactStorage.insert(contact.id, contact);
    return Result.Ok<Contact, string>(contact);
  } catch (error) {
    return Result.Err<Contact, string>(
      "Could not add contact for : " + payload.name
    );
  }
}

// get contact
$query;
export function getContact(id: string): Result<Contact, string> {
  const contact = contactStorage.get(id);
  return match(contact, {
    Some: (contact) => {
      return Result.Ok<Contact, string>(contact);
    },
    None: () => {
      return Result.Err<Contact, string>(
        "Could not find contact with id: " + id
      );
    },
  });
}

// get all contacts
$query;
export function getAllContacts(): Result<Vec<Contact>, string> {
  const contacts = contactStorage.values();
  // check if there are any contacts
  if (contacts.length === 0) {
    return Result.Err<Vec<Contact>, string>(
      "No contacts found, please add one"
    );
  }
  return Result.Ok<Vec<Contact>, string>(contacts);
}

// search contacts by name
$query;
export function searchContactsByName(
  name: string
): Result<Vec<Contact>, string> {
  const contacts = contactStorage.values();
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(name.toLowerCase())
  );

  // check if there are any contacts
  if (filteredContacts.length === 0) {
    return Result.Err<Vec<Contact>, string>(
      "No contacts found, please add one"
    );
  }
  return Result.Ok<Vec<Contact>, string>(filteredContacts);
}

// search contacts by company
$query;
export function searchContactsByCompany(
  company: string
): Result<Vec<Contact>, string> {
  const contacts = contactStorage.values();
  const filteredContacts = contacts.filter((contact) =>
    contact.company.toLowerCase().includes(company.toLowerCase())
  );

  // check if there are any contacts
  if (filteredContacts.length === 0) {
    return Result.Err<Vec<Contact>, string>(
      "No contacts found, please add one"
    );
  }
  return Result.Ok<Vec<Contact>, string>(filteredContacts);
}

// search contacts by label
$query;
export function searchContactsByLabel(
  label: string
): Result<Vec<Contact>, string> {
  const contacts = contactStorage.values();
  const filteredContacts = contacts.filter((contact) =>
    contact.label.toLowerCase().includes(label.toLowerCase())
  );

  // check if there are any contacts
  if (filteredContacts.length === 0) {
    return Result.Err<Vec<Contact>, string>(
      "No contacts found, please add one"
    );
  }
  return Result.Ok<Vec<Contact>, string>(filteredContacts);
}

// search contacts by address
$query;
export function searchContactsByAddress(
  address: string
): Result<Vec<Contact>, string> {
  const contacts = contactStorage.values();
  const filteredContacts = contacts.filter((contact) =>
    contact.address.toLowerCase().includes(address.toLowerCase())
  );

  // check if there are any contacts
  if (filteredContacts.length === 0) {
    return Result.Err<Vec<Contact>, string>(
      "No contacts found, please add one"
    );
  }
  return Result.Ok<Vec<Contact>, string>(filteredContacts);
}

// search contacts by phone number
$query;
export function searchContactsByPhoneNumber(
  number: number
): Result<Vec<Contact>, string> {
  const contacts = contactStorage.values();
  const filteredContacts = contacts.filter((contact) =>
    contact.number.toString().includes(number.toString())
  );
  // check if there are any contacts
  if (filteredContacts.length === 0) {
    return Result.Err<Vec<Contact>, string>(
      "No contacts found, please add one"
    );
  }
  return Result.Ok<Vec<Contact>, string>(filteredContacts);
}

// update contact
$update;
export function updateContact(
  id: string,
  payload: ContactPayload
): Result<Contact, string> {
  // Validate input
  if (
    !payload.name ||
    !payload.number ||
    !payload.address ||
    !payload.company ||
    !payload.label ||
    !payload.info
  ) {
    return Result.Err<Contact, string>("Missing some fields in input data");
  }

  const contact = contactStorage.get(id);
  return match(contact, {
    Some: (contact) => {
      const updatedContact = {
        ...contact,
        ...payload,
        updated_at: Opt.Some(ic.time()),
      };
      contactStorage.insert(id, updatedContact);
      return Result.Ok<Contact, string>(updatedContact);
    },
    None: () => {
      return Result.Err<Contact, string>(
        "Could not find contact with id: " + id
      );
    },
  });
}

// delete contact
$update;
export function deleteContact(id: string): Result<Contact, string> {
  const contact = contactStorage.get(id);
  return match(contact, {
    Some: (contact) => {
      try {
        contactStorage.remove(id);
        return Result.Ok<Contact, string>(contact);
      } catch (error) {
        return Result.Err<Contact, string>(
          "Could not delete contact with id: " + id
        );
      }
    },
    None: () => {
      return Result.Err<Contact, string>(
        "Could not find contact with id: " + id
      );
    },
  });
}

// UUID workaround
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};
