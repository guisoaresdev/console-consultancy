"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Agenda = /** @class */ (function () {
    function Agenda() {
        this.listaAgendamento = [];
    }
    Agenda.prototype.getListaAgendamento = function () {
        return this.listaAgendamento;
    };
    Agenda.prototype.agendarConsulta = function (agendamento) {
        this.getListaAgendamento().push(agendamento);
    };
    Agenda.prototype.ordenarPorData = function () {
        return this.getListaAgendamento().sort(function (a, b) { return a.data_consulta.getTime() - b.data_consulta.getTime(); });
    };
    Agenda.prototype.printAgendaFormatada = function () {
        console.log("------------------------------------------------------------");
        console.log("CPF Nome                                   Dt.Nasc.    Idade");
        console.log("------------------------------------------------------------");
        this.ordenarPorData().forEach(function (_a) {
            var paciente = _a.paciente, data_consulta = _a.data_consulta, hora_inicial = _a.hora_inicial, hora_final = _a.hora_final;
            var cpfFormatado = paciente.getCpf().padStart(11, "0");
            var nomeFormatado = paciente.getNome().padEnd(30, " ");
            var dataNascFormatada = paciente.getData_nasc().toLocaleDateString();
            var idadeFormatada = paciente.getIdade().toString().padStart(3, " ");
            console.log("".concat(cpfFormatado, " ").concat(nomeFormatado, " ").concat(dataNascFormatada, " ").concat(idadeFormatada));
            console.log("Agendado para: ".concat(data_consulta.toLocaleDateString()));
            console.log("".concat(hora_inicial, " \u00E0s ").concat(hora_final, "\n"));
        });
    };
    return Agenda;
}());
exports.default = Agenda;
