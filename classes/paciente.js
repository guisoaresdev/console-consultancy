export default class Paciente {
    constructor(cpf, nome, data_nasc) {
        this.setCpf(cpf);
        this.setNome(nome);
        this.setData_nasc(data_nasc);
    }
    static criarPaciente(cpf, nome, data_nasc) {
        if (!Paciente.isValidCPF(cpf)) {
            console.log("Paciente não possui um CPF válido, tente novamente.");
            return null;
        }
        if (nome.trim().length === 0) {
            console.log("Nome não pode ser vázio");
            return null;
        }
        if (isNaN(data_nasc.getTime())) {
            console.log("Data de nascimento inválida");
            return null;
        }
        return new Paciente(cpf, nome, data_nasc);
    }
    getCpf() {
        return this.cpf;
    }
    setCpf(value) {
        this.cpf = value;
    }
    getNome() {
        return this.nome;
    }
    setNome(value) {
        this.nome = value;
    }
    getData_nasc() {
        return this.data_nasc;
    }
    setData_nasc(value) {
        this.data_nasc = value;
        this.idade = this.calcularIdade(value);
    }
    getIdade() {
        return this.idade;
    }
    calcularIdade(data_nasc) {
        const hoje = new Date();
        let idade = hoje.getFullYear() - data_nasc.getFullYear();
        const mes = hoje.getMonth() - data_nasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < data_nasc.getDate())) {
            idade--;
        }
        return idade;
    }
    static isValidCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
            return false;
        let sum = 0;
        let remainder;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11)
            remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10)))
            return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11)
            remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    }
}
