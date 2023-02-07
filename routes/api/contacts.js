const express = require("express");

const { Contact } = require("../../models/contact-schema");

const { validateBody } = require("../../middlewares/validateBody");
const { contactSchema } = require("../../schemas/contactsSchemas");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find({});
    return res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (contact) return res.json(contact);
    res
      .status(404)
      .json({ message: `Contact with id=${req.params.contactId} not found!` });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { error } = await validateBody(contactSchema);
  try {
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // const { name, email, phone } = req.body;

    // if (!name || !email || !phone)
    //   return res.status(400).json({ message: "missing required name field" });

    const newContact = await Contact.create(req.body);

    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const removedContact = await Contact.findById(req.params.contactId);
    if (!removedContact) {
      return res.status(404).json({
        message: `Contact with id=${req.params.contactId} not found!`,
      });
    }
    await Contact.findByIdAndRemove(req.params.contactId);
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { error } = await validateBody(contactSchema);
  try {
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    // const { name, email, phone } = req.body;

    // if (!name && !email && !phone)
    //   return res.status(400).json({ message: "missing fields" });

    const response = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body
    );

    if (response) return res.json(response);
    return res.status(404).json({
      message: `Contact with id=${req.params.contactId} not found!`,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { error } = await validateBody(contactSchema);
  try {
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { favorite } = req.body;

    if (!favorite)
      return res.status(400).json({ message: "missing field favorite" });
    const response = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body
    );

    if (response) return res.json(response);
    return res.status(404).json({
      message: `Contact with id=${req.params.contactId} not found!`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
