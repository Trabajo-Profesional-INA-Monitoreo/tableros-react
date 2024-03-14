
const baseUrl = 'http://localhost:5000/api/v1'

export default class configurationService{

    async deleteConfigByID(id){
    
        //const response = await fetch(baseUrl+"/configuration/"+{id}, {method: "DELETE"})
        //return response.status
    }

    async getConfigurations() {
        // const response = await fetch(baseUrl+"/configuration");
         //const res = await response.json();
    
        return [{name:"config 1", id: 1}, {name: "config 2", id:2}, {name:"config 3", id:3 }]
    }
}
