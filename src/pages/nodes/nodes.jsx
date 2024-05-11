import React from 'react';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import { NodePresenter } from '../../presenters/nodePresenter';
import Line from '../../components/line/line';

export const Nodes = () => {
    
    const presenter = new NodePresenter();
    
    const [nodes, setNodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const getNodes = async() => {
        const response = await presenter.getNodes();
        setNodes(response.Nodes);
        setIsLoading(false);
    }

    useEffect(() => {
        getNodes();
    }, []);

    return (    
        <Box>
            <h1>Nodos</h1>
            <CurrentConfiguration/>
            <Line/>
            <InformativeCardContainer>
            {isLoading ? null : nodes.map(node => 
                <InformativeCard 
                    title={node.NodeName+' | '+node.NodeId}
                    subtitle={node.StreamsCount + (Number(node.StreamsCount) > 1 ? ' series' : ' serie')}
                    heading1={node.LastUpdate}
                    heading2={node.ErrorCount}
                    heading3={node.TotalWaterLevels>0? (node.AlertWaterLevels / node.TotalWaterLevels)*100 : 0}
                    subheading1={'Última actualización'}
                    subheading2={'Errores'}
                    subheading3={'Nivel'}
                />
            )}    
            </InformativeCardContainer>
        </Box>
    );
}