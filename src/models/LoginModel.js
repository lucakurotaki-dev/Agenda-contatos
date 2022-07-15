const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');


const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async register(){
        //verifica as informações passadas no registro
        this.validate();
        //verifica se erros foram identificados ao validar
        if(this.errors.length > 0){
            return
        }

        //verifica se o usuário já existe no banco
        await this.userExists();

        if(this.errors.length > 0){
            return
        }

        //antes de criar o usuário no banco, criptografa a senha
        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
        
        this.user = await LoginModel.create(this.body);
        
    }

    async login(){
        this.validate();
        if(this.errors.length > 0){
            return;
        }
        this.user = await LoginModel.findOne({email: this.body.email});

        if(this.user == null){
            this.errors.push("This user doesn't exist.");
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Password is incorrect.');
            this.user = null;
            return;
        }
    }

    async userExists(){
        this.user = await LoginModel.findOne({email: this.body.email});


        if(this.user){
            this.errors.push('This user already exists.')
        }
    }

    validate(){
        //limpa o objeto
        this.cleanUp();

        //verifica o e-mai, e adiciona um flag ao this.errors caso seja inválido
        if(!validator.isEmail(this.body.email)){
            this.errors.push('Invalid email')
        }

        //verifica a quantidade de caracteres da senha
        if(this.body.password.length < 3 || this.body.password.length > 50){
            this.errors.push('Your email must be at least 3 characters long.')
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
            email: this.body.email,
            password: this.body.password
        };
    }
}

module.exports = Login;
