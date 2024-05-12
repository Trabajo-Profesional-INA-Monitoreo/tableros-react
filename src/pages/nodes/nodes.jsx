import React from 'react';
import { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import { NodePresenter } from '../../presenters/nodePresenter';
import Line from '../../components/line/line';


function formatDate(isoDate) {
    const date = new Date(isoDate);
    const offset = -3 * 60 * 60 * 1000; // GMT-3 offset in milliseconds
    const gmt3Date = new Date(date.getTime() + offset);
    const day = gmt3Date.getDate().toString().padStart(2, '0');
    const month = (gmt3Date.getMonth() + 1).toString().padStart(2, '0');
    const year = gmt3Date.getFullYear();
    const hours = gmt3Date.getHours().toString().padStart(2, '0');
    const minutes = gmt3Date.getMinutes().toString().padStart(2, '0');
    const seconds = gmt3Date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

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
                    {isLoading ?
                        <CircularProgress 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100vh',
                            margin: 'auto',
                            width: '10vw'
                        }}
                        />
                        :
                        nodes.map(node => 
                            <InformativeCard 
                                title={node.NodeName+' | '+node.NodeId}
                                subtitle={`${node.StreamsCount + (Number(node.StreamsCount) > 1 ? ' series' : ' serie')} ${node.MainStreamId ? (' | Serie principal: ' + node.MainStreamId) :"" }`}
                                heading1={node.LastUpdate && formatDate(node.LastUpdate)}
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