import utilsService from "../services/utilsServices";

export class UtilsPresenter {

    utilsService = new utilsService();

    getAllVariables = async() => {
        return this.utilsService.getAllVariables();
    }

    getAllProcedures = async() => {
        return this.utilsService.getAllProcedures();
    }

}
