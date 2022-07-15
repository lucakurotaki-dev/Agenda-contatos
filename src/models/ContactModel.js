const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: {type: String, required: true},
  lastname: {type: String, required: false, default: ''},
  email: {type: String, required: false, default: ''},
  tel: {type: String, required: false, default: ''},
  date: {type: Date, default: Date.now},
});

const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
  constructor(body){
      this.body = body;
      this.errors = [];
      this.contact = null;
  }

  async register(){
      //verifica as informações passadas no registro
      this.validate();
      //verifica se erros foram identificados ao validar
      if(this.errors.length > 0){
          return;
      }

      this.contact = await ContactModel.create(this.body);
      
  }

  static async findById(id){
    if(typeof id !== 'string'){
      return;
    }
    const user = await ContactModel.findById(id);
    return user;
  }

  validate(){
      //limpa o objeto
      this.cleanUp();

      //verifica se o email foi enviado e se o e-mail é válido, e adiciona um flag ao this.errors caso seja inválido
      if(this.body.email && !validator.isEmail(this.body.email)){
          this.errors.push('Invalid email')
      }

      //Verifica se o campo obrigatório foi preenchido.
      if(!this.body.name){
        this.errors.push('"Name" is required.');
      }

      //Pede para preencher pelo menos um dos campos, email ou telefone
      if(!this.body.email && !this.body.tel){
        this.errors.push('Please fill in at least one field: "Email" or "Phone number".');
      }
  }

  cleanUp(){
      for(let key in this.body){
          if(typeof this.body[key] !== 'string'){
              this.body[key] = '';
          }
      }

      //garante que csrf não será passada
      this.body = {
          name: this.body.name,
          lastname: this.body.lastname,
          email: this.body.email,
          tel: this.body.tel,
      };
  }
}

module.exports = Contact;
