const baseUrl = 'http://localhost:5000/api/v1'

export default class configurationService{

    async getSeriesbyIdConfig(id) {
        const response = await fetch(baseUrl+"/series?configurationId="+id)
        const res = await response.json()
        return res
    }
}