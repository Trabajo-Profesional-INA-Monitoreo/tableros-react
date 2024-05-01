import { makeAutoObservable } from "mobx";
import configurationService from "../services/configurationService"

export class ConfigurationListPresenter {
    configurationServer= new configurationService()
    
    constructor(){
        makeAutoObservable( this );
    }


    onDeleteConfig = async (id) => {
        this.configurationServer.deleteConfigByID(id)
    }

    getConfigurations = async() => {
        return this.configurationServer.getConfigurations()
    }
}
