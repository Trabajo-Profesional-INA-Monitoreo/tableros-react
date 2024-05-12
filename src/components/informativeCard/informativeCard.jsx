import Line from '../line/line';
import { Box } from '@mui/material';
import './informativeCard.css';

export function InformativeCard({title, subtitle, heading1, heading2, heading3, subheading1, subheading2, subheading3}) {
  const titleSubtitleWidth = 100;
  return (
    <Box className='column container'>
        <TitleSubtitle heading={title} subheading={subtitle}/>
        <Line/>
        <Box className='row'> 
            {heading1 && <TitleSubtitle heading={heading1} subheading={subheading1} width={titleSubtitleWidth}/>}
            <TitleSubtitle heading={heading2} subheading={subheading2} width={titleSubtitleWidth}/>
            <TitleSubtitle heading={heading3} subheading={subheading3} width={titleSubtitleWidth}/>
        </Box>
    </Box>
  );
};

function TitleSubtitle({heading, subheading, width}){
  return(
    <Box className='column' sx={{width: width}}>
        <p><center><b>{heading}</b></center></p>
        <p style={{color:'#acabab'}}><center>{subheading}</center></p>
    </Box>
  )
};

export function InformativeCardContainer({children}){
  return <Box className='cards-container' sx={{justifyContent: "center"}}>{children}</Box>
};