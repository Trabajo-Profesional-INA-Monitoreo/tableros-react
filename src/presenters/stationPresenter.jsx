import stationService from "../services/stationService";

export class StationPresenter {

    stationService = new stationService();

    getStations = async(page) => {
        return this.stationService.getStations(page);
    }

    getAllStationsNames = async() => {
        return this.stationService.getAllStationsNames();
    }

}
