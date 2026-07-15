"use client";

export type CustomerSession = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type StoredCustomer = CustomerSession & {
  password: string;
};

const customersKey = "aether.customers";
const sessionKey = "aether.customerSession";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readCustomers(): StoredCustomer[] {
  try {
    return JSON.parse(window.localStorage.getItem(customersKey) || "[]") as StoredCustomer[];
  } catch {
    return [];
  }
}

function writeCustomers(customers: StoredCustomer[]) {
  window.localStorage.setItem(customersKey, JSON.stringify(customers));
}

function writeSession(customer: CustomerSession) {
  window.localStorage.setItem(sessionKey, JSON.stringify(customer));
  window.dispatchEvent(new Event("aether-customer-changed"));
}

export function getCurrentCustomer(): CustomerSession | null {
  try {
    return JSON.parse(window.localStorage.getItem(sessionKey) || "null") as CustomerSession | null;
  } catch {
    return null;
  }
}

export function registerCustomer(input: { name: string; email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const name = input.name.trim();
  const password = input.password.trim();

  if (name.length < 2) throw new Error("Enter your full name.");
  if (!email.includes("@")) throw new Error("Enter a valid email.");
  if (password.length < 6) throw new Error("Use at least 6 characters.");

  const customers = readCustomers();
  if (customers.some((customer) => customer.email === email)) {
    throw new Error("This email already has an account. Sign in instead.");
  }

  const customer: StoredCustomer = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  writeCustomers([...customers, customer]);
  const session = { id: customer.id, name: customer.name, email: customer.email, createdAt: customer.createdAt };
  writeSession(session);
  return session;
}

export function loginCustomer(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const password = input.password.trim();
  const customer = readCustomers().find((candidate) => candidate.email === email && candidate.password === password);

  if (!customer) {
    throw new Error("Email or password is incorrect.");
  }

  const session = { id: customer.id, name: customer.name, email: customer.email, createdAt: customer.createdAt };
  writeSession(session);
  return session;
}

export function logoutCustomer() {
  window.localStorage.removeItem(sessionKey);
  window.dispatchEvent(new Event("aether-customer-changed"));
}
