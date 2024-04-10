import { BASE_URL } from '../utils/service';

export default class configurationService{

    async deleteConfigByID(id){
        const response = await fetch(BASE_URL+"/configuracion/"+id, {method: "DELETE"});
        return response.status;
    }

    async getConfiguration(id) {
        const response = await fetch(BASE_URL+"/configuracion/"+id);
        const res = await response.json();
        return res;
    }

    async getConfigurations() {
        const response = await fetch(BASE_URL+"/configuracion");
        const res = await response.json();
        return res;
    }

    async postConfiguration(body) {
        const response = await fetch(BASE_URL+"/configuracion", {
            method: "POST",        
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          });
        const res = await response.json();
        return res;
    }

    async putConfiguration(body) {
        const response = await fetch(BASE_URL+"/configuracion", {
            method: "PUT",        
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          });
        const res = await response.json();
        return res;
    }
}
