
const baseUrl = 'http://localhost:5000/api/v1'

export default class configurationService{

    async deleteConfigByID(id){
        const response = await fetch(baseUrl+"/configuracion/"+id, {method: "DELETE"})
        return response.status
    }

    async getConfigurations() {
        const response = await fetch(baseUrl+"/configuracion")
        const res = await response.json()
        return res
    }

    async postConfiguration(body) {
        const response = await fetch(baseUrl+"/configuracion", {
            method: "POST",        
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
          });
        const res = await response.json();
        return res
    }
}
