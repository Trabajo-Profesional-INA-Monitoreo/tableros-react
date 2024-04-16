import stationService from "../services/stationService";

export class StationPresenter {

    stationService = new stationService();

    getStations = async(configurationId) => {
        return this.stationService.getStations(configurationId);
    }

}
