import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";
import { getOptions } from "../utils/service";

export default class nodeService {

    async getNodes() {
        const response = await fetch(`${BASE_URL}/series/nodos?configurationId=${getConfigurationID()}`,getOptions());
        const res = await response.json();
        return res;
    }

}
