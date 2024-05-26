import OutputsService from "../services/outputsService";

export class OutputsPresenter {

    outputsService = new OutputsService();

    getErroresPorDia = async(id) => {
        return this.outputsService.getErroresPorDia(id);
    }

}
