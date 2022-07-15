const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    });
    return;
}

exports.register = async (req, res) => {
    try{
        const contact = new Contact(req.body);
        await contact.register();
    
        if (contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }
        req.flash('success', "The contact has been registered successfully.");
        req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
        return;
    } catch(e){
        console.log(e);
        return res.render('404');
    }
    
}

exports.editIndex = async (req, res) =>{
    try{
        if(!req.params.id){
            return res.render('404');
        }
        const contact = await Contact.findById(req.params.id);
        if(!contact){
            return res.render('404');
        }
        res.render('contact', {contact});
    }catch(e){
        console.log(e);
        res.render('404');
    }
    
    
}