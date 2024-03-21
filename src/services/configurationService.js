
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
}
