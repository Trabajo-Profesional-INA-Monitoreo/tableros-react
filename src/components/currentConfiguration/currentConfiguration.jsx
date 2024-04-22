import { getConfigurationName } from '../../utils/storage';

export function CurrentConfiguration() {

   const configurationName = getConfigurationName();

    return (
        <h4>Configuración actual: <span style={{fontWeight: 'normal'}}>{configurationName? configurationName : "No ha seleccionado ninguna"}</span></h4>
    );
};
