"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Paciente = /** @class */ (function () {
    function Paciente(cpf, nome, data_nasc) {
        this.setCpf(cpf);
        this.setNome(nome);
        this.setData_nasc(data_nasc);
    }
    Paciente.criarPaciente = function (cpf, nome, data_nasc) {
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
    };
    Paciente.prototype.getCpf = function () {
        return this.cpf;
    };
    Paciente.prototype.setCpf = function (value) {
        this.cpf = value;
    };
    Paciente.prototype.getNome = function () {
        return this.nome;
    };
    Paciente.prototype.setNome = function (value) {
        this.nome = value;
    };
    Paciente.prototype.getData_nasc = function () {
        return this.data_nasc;
    };
    Paciente.prototype.setData_nasc = function (value) {
        this.data_nasc = value;
        this.idade = this.calcularIdade(value);
    };
    Paciente.prototype.getIdade = function () {
        return this.idade;
    };
    Paciente.prototype.calcularIdade = function (data_nasc) {
        var hoje = new Date();
        var idade = hoje.getFullYear() - data_nasc.getFullYear();
        var mes = hoje.getMonth() - data_nasc.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < data_nasc.getDate())) {
            idade--;
        }
        return idade;
    };
    Paciente.isValidCPF = function (cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf))
            return false;
        var sum = 0;
        var remainder;
        for (var i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11)
            remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10)))
            return false;
        sum = 0;
        for (var i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11)
            remainder = 0;
        return remainder === parseInt(cpf.substring(10, 11));
    };
    return Paciente;
}());
exports.default = Paciente;
