import nodeService from "../services/nodeService";

export class NodePresenter {

    nodeService = new nodeService();

    getNodes = async() => {
        return this.nodeService.getNodes();
    }

}
