import { makeAutoObservable } from "mobx";
import { useModalService } from "../providers/modalProvider"
import configurationService from "../services/configurationService"

export class ConfigurationListPresenter {
    modalService= useModalService()
    configurationServer= new configurationService()
    
    constructor(){
        makeAutoObservable( this );
    }

    onDeleteConfigPressed = async (children) => {
		this.modalService.show( children );
	};


    onDeleteConfig = async (id) => {
        this.configurationServer.deleteConfigByID(id)
        this.modalService.hide()
    }

    onCancelDeleteConfig = async () => {
        this.modalService.hide()
    }

    getConfigurations = async() => {
        return this.configurationServer.getConfigurations()
    }
}
