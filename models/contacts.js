const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const contactsPath = path.join("./models/contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = await JSON.parse(data);
  return parsedData;
};

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = await JSON.parse(data);
  const result = await parsedData.find((item) => item.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = await JSON.parse(data);
  const delContact = await parsedData.find((item) => item.id === contactId);
  if (delContact) {
    const index = parsedData.indexOf(delContact);
    parsedData.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(parsedData), "utf-8");
    return delContact;
  }
  return null;
};

const addContact = async (body) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = await JSON.parse(data);
  const id = await nanoid();

  const newContact = {
    id,
    ...body,
  };
  const refreshedContacts = [...parsedData, newContact];
  await fs.writeFile(contactsPath, JSON.stringify(refreshedContacts), "utf-8");
  return newContact;
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath, "utf-8");
  const parsedData = await JSON.parse(data);
  const oldContact = await parsedData.find((item) => item.id === contactId);
  if (oldContact) {
    const updatedContact = { ...oldContact, ...body };
    const index = parsedData.indexOf(oldContact);
    parsedData.splice(index, 1, updatedContact);
    await fs.writeFile(contactsPath, JSON.stringify(parsedData), "utf-8");
    return updatedContact;
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
