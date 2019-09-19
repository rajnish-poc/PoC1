import React, { Component } from 'react';
import './App.css';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { Jumbotron, Col, Input, InputGroup, InputGroupAddon, FormGroup, Label, Button, Fade, FormFeedback, Container, Card } from 'reactstrap';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';
import moment from 'moment';
import logger from './Logger';
import Hello from './Hello';


let excelFileName;
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            dataLoaded: false,
            isFormInvalid: false,
            rows: null,
            cols: null
        }
        this.fileHandler = this.fileHandler.bind(this);
        this.toggle = this.toggle.bind(this);
        this.openFileBrowser = this.openFileBrowser.bind(this);
        this.renderFile = this.renderFile.bind(this);
        this.fileInput = React.createRef();

        //this.exportGrid = this.exportGrid.bind(this);//For Arrow Function bind is not needed
        this.hotTable = React.createRef();
        
    }

    //Written by Rajnish for export grid to excel
    exportGrid = () => {
        
        //Specific file name
        var htmltable = document.getElementsByClassName('htCore');
        var html = htmltable[0].outerHTML;

        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/vnd.ms-excel,' + encodeURIComponent(html));
        element.setAttribute('download', 'TimeSheetError');//provide file name

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    renderFile = (fileObj) => {
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                resp.cols.push({ name: "G", key: 6 });//Push a new column to show Error

                resp.rows.forEach(this.validateRows);

                const excelRows = resp.rows.slice(1, resp.rows.length);//Slice first row as it shows header as data
                //console.log(JSON.stringify(excelRows));
                
                this.setState({
                    dataLoaded: true,
                    cols: resp.cols,
                    rows: excelRows
                });
            }
        });
    }

    //Written by Rajnish for export grid to excel
    validateRows = (item, index) => {
        if (index === 0) {
            item.push("Error/Warning");
        }
        else {
            item.push("");
        }
        let err = ""
        if (item[1] === undefined || item[1] === "") {
            err += "Emp. Name cannot be blank.\n";
        }
        if (item[2] === undefined || item[2] === "") {
            err += "Task Name cannot be blank.\n";
        }    
        if (item[3] === undefined || item[3] === "") {
            err += "Project cannot be blank.\n";
        }

        let dateFormat = 'DD-MM-YYYY';
        
        if (item[4] === undefined || item[4] === "") {
            err += "Date cannot be blank.\n";
        }
        
        if (item[5] === undefined || item[5] === "") {
            err += "Time Duration cannot be blank.\n";
        }
        item[6] = err;

        
        if (err !== '') {
            logger.push(excelFileName + ' -> #' + index + ' - ' + err);
            console.log(index + ' - ' + err);
        }
        
    }

    fileHandler = (event) => {
        if (event.target.files.length) {
            let fileObj = event.target.files[0];
            let fileName = fileObj.name;


            //check for file extension and pass only if it is .xlsx and display error message otherwise
            if (fileName.slice(fileName.lastIndexOf('.') + 1) === "xlsx") {
                this.setState({
                    uploadedFileName: fileName,
                    isFormInvalid: false
                });
                excelFileName = fileName;
                this.renderFile(fileObj)
            }
            else {
                this.setState({
                    isFormInvalid: true,
                    uploadedFileName: ""
                })
            }
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    openFileBrowser = () => {
        this.fileInput.current.click();
    }

    render() {
        return (
            <div>
                <Container>
                    <form>
                        <FormGroup row>
                            <Label for="exampleFile" xs={6} sm={4} lg={2} size="lg">Upload Timesheet</Label>
                            <Col xs={4} sm={8} lg={10}>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <Button color="info" style={{ color: "white", zIndex: 0 }} onClick={this.openFileBrowser.bind(this)}><i className="cui-file"></i> Browse&hellip;</Button>
                                        <input type="file" hidden onChange={this.fileHandler.bind(this)} ref={this.fileInput} onClick={(event) => { event.target.value = null }} style={{ "padding": "5px" }} />
                                    </InputGroupAddon>
                                    <Input type="text" className="form-control" value={this.state.uploadedFileName} readOnly invalid={this.state.isFormInvalid} />
                                    <FormFeedback>
                                        <Fade in={this.state.isFormInvalid} tag="h6" style={{ fontStyle: "italic" }}>
                                            Please select a .xlsx file only !
                                    </Fade>
                                    </FormFeedback>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                    </form>

                    {this.state.dataLoaded &&
                        <div>
                        <Button id="export-file" onClick={this.exportGrid.bind(this)}>Export</Button>
                            {/*<div>
                            <Card body outline color="secondary" className="restrict-card">
                                    <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />

                                </Card>
                            </div>*/}
                        <br /><br />
                            <div id="hot-app">
                                <HotTable
                                    ref={this.hotTable}
                                    readOnly={true}
                                    filters={true}
                                    dropdownMenu={['filter_by_value', 'filter_action_bar']}
                                
                                    data={this.state.rows}
                                    rowHeaders={false}
                                    colHeaders={["Sr.No.", "Emp.Name", "Task Name", "Project", "Date (DD-MM-YYYY)", "Time Duration (hh:mm)", "Error/Warning"]}
                                    columnSorting={true}
                                    width="1200"
                                    height="500" />
                        </div>
                        
                        </div>}

                </Container>
            </div>
        );
    }
    
    
}

export default App;
