const Contact = require('../models/ContactModel');

exports.index =  async (req, res) => {
  const contacts = await Contact.findContacts();
  res.render('index', {contacts});//{contacts} é equivalente a {contacts: contacts}
  return;
};

