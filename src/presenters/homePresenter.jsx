//aca va todo lo logico de esa pantalla
import { makeAutoObservable } from "mobx";

import { useModalService } from "../providers/modalProvider"


export class HomePresenter{
    modalService= useModalService()

    constructor(){
        makeAutoObservable( this );
    }

    getCantSeries(){
        return "24"
    }

    getCantEstaciones(){
        return "39"
    }

    getCantRedes(){
        return "59"
    }

    onDeleteConfigPressed = async (children) => {
		this.modalService.show( children );
	};

}