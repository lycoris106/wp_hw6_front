import { useState, SyntheticEvent } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Tab from '@mui/material/Tab';
import TabList from "@mui/lab/TabList";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from "@mui/lab/TabContext";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



import { useStyles } from '../hooks/useStyles.js';
import axios from '../api.js';
import { useScoreCard } from '../hooks/useScoreCard.js';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box sx={{ p: 3 }}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// function a11yProps(index: number) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`,
//   };
// }

const Body = () => {
  const classes = useStyles();

  const { messagesAdd, messagesQuery, addCardMessage, addRegularMessage, addErrorMessage } = useScoreCard();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);

  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');

  const [value, setValue] = useState('add');



  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleValueChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleAdd = async () => {
    console.log('adding', name, subject, score);
    const {
      data: { message, card, tableContent },
    } = await axios.post('/card', {
      name,
      subject,
      score,
    });

    console.log('tableContent:', tableContent);
    if (!card) addErrorMessage('add', message);
    else {
      addCardMessage(message, tableContent);
    }
  };

  const handleQuery = async () => {
    const {
      data: { messages, message },
    } = await axios.get('/cards', {
      params: {
        type: queryType,
        queryString,
      },
    });

    console.log(messages);
    if (!messages) addErrorMessage('query', message);
    else addRegularMessage(messages);
  };

  return (
    <Wrapper>
      <TabContext value={value}>
        <TabList
          onChange={handleValueChange}
          aria-label="tab label"
        >
          <Tab value='add' label="Add"/>
          <Tab value='query' label="Query"/>
        </TabList >
        <TabPanel value="add">
          <Row>
            <TextField
              className={classes.input}
              placeholder="Name"
              value={name}
              onChange={handleChange(setName)}
            />
            <TextField
              className={classes.input}
              placeholder="Subject"
              style={{ width: 240 }}
              value={subject}
              onChange={handleChange(setSubject)}
            />
            <TextField
              className={classes.input}
              placeholder="Score"
              value={score}
              onChange={handleChange(setScore)}
              type="number"
            />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={!name || !subject}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Row>
          <ContentPaper variant="outlined">
            {messagesAdd.map((m, i) => {
              {/* console.log('messagesAdd:', messagesAdd); */}
              if (typeof m.message === 'string' || m.message instanceof String) {
                return (
                  <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                    {m.message}
                  </Typography>
                );
              } else {

                return (
                  <TableContainer key={'table' + i} component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Subject</TableCell>
                          <TableCell>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {m.message.map((mm, j) => (
                          <TableRow key={j}>
                            <TableCell>{mm.name}</TableCell>
                            <TableCell>{mm.subject}</TableCell>
                            <TableCell>{mm.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              }
            })}
          </ContentPaper>
        </TabPanel>
        <TabPanel value="query">
          <Row>
            <StyledFormControl>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={queryType}
                  onChange={handleChange(setQueryType)}
                >
                  <FormControlLabel
                    value="name"
                    control={<Radio color="primary" />}
                    label="Name"
                  />
                  <FormControlLabel
                    value="subject"
                    control={<Radio color="primary" />}
                    label="Subject"
                  />
                </RadioGroup>
              </FormControl>
            </StyledFormControl>
            <TextField
              placeholder="Query string..."
              value={queryString}
              onChange={handleChange(setQueryString)}
              style={{ flex: 1 }}
            />
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={!queryString}
              onClick={handleQuery}
            >
              Query
            </Button>
          </Row>
          <ContentPaper variant="outlined">
            {messagesQuery.map((m, i) => {
              {/* console.log('messagesQuery:', messagesQuery); */}
              if (typeof m.message === 'string' || m.message instanceof String) {
                return (
                  <Typography variant="body2" key={m + i} style={{ color: m.color }}>
                    {m.message}
                  </Typography>
                );
              } else {

                return (
                  <TableContainer key={'table' + i} component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Subject</TableCell>
                          <TableCell>Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {m.message.map((mm, j) => (
                          <TableRow key={j}>
                            <TableCell>{mm.name}</TableCell>
                            <TableCell>{mm.subject}</TableCell>
                            <TableCell>{mm.score}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                );
              }
            })}
          </ContentPaper>
        </TabPanel>
      </TabContext>
    </Wrapper>
  );
};

export default Body;
