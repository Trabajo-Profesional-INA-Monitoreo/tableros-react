import { BASE_URL } from '../utils/service';
import {getToken} from '../utils/storage';
import { getOptions } from "../utils/service";

export default class configurationService{

    async deleteConfigByID(id){
        const response = await fetch(BASE_URL+"/configuracion/"+id, getOptions({method: "DELETE"}));
        return response.status;
    }

    async getConfiguration(id) {
        const response = await fetch(BASE_URL+"/configuracion/"+id,getOptions());
        const res = await response.json();
        return res;
    }

    async getConfigurations() {
        const response = await fetch(BASE_URL+"/configuracion",getOptions());
        const res = await response.json();
        return res;
    }

    async postConfiguration(body) {
        const response = await fetch(BASE_URL+"/configuracion", getOptions({
            method: "POST",        
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          }));
        const res = await response.json();
        return res;
    }

    async putConfiguration(body) {
        const response = await fetch(BASE_URL+"/configuracion", getOptions({
            method: "PUT",        
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          }));
        const res = await response.json();
        return res;
    }
}
