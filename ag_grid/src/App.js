import { AgGridReact } from 'ag-grid-react';

import "./app.css"
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import { useState, useRef, useEffect, useCallback } from 'react';

function App() {
    const [gridApi, setGridApi]=useState()
    let selectedData;

    const [rowData, setRowData] = useState([
        { make: "brezza", model: "vitara", price: "12 Lakhs" }
    ]);

    const [columnDefs, setColumnDefs] = useState([
        { field: 'make', checkboxSelection: true, headerCheckboxSelection: true },  //headerName: "kauaa"
        { field: 'model' },

        // for inline Css
        // { field: "price", cellStyle: (e) => (e.value < 40000 ? { background: "green" } : { background: "#d96161" }) },

        { field: "price", tooltipField: "make", cellClass: (e) => (e.value < 40000 ? "priceLessThan40000" : "priceGreaterThan40000") },
        {
            field: "action",
            cellRendererFramework: (params) =>
                <div>
                    <button onClick={() => actionButton(params)}>Click me</button>
                </div>
        }
    ]);

    const actionButton = (event) => {
        console.log(event.data);
        alert(event.data.make + " row clicked")
    }

    const defaultColDef = { sortable: true, filter: true, editable: true, floatingFilter: true };

    // const cellClickedListener = useCallback(function (event) { //handel cell click
    //     console.log('cellClicked', event);
    // });

    const onGridReady = (params) => {
        fetch("https://www.ag-grid.com/example-assets/row-data.json")
            .then(resp => resp.json())
            .then(resp => {
                params.api.applyTransaction({ add: resp })
            })
            params.api.paginationSetPageSize(10)
        setGridApi(params.api)
    }

    const handleExportAll = function () {
        gridApi.exportDataAsCsv();
    }

    const onSelectionChanged=(event)=>{
        // selectedData =  event.api.getSelectedRows();
        console.log(event);
    }

    const onPaginationChange=(pageSize)=>{
        gridApi.paginationSetPageSize(Number(pageSize))
    }

    return (
        <div>
            <button onClick={() => handleExportAll()}>Export All</button>
            <select onChange={(e) => onPaginationChange(e.target.value)}>
                <option value='10'>10</option>
                <option value='25'>25</option>
                <option value='50'>50</option>
                <option value='100'>100</option>
            </select>

            <div className="ag-theme-alpine-dark" style={{ height: "95vh", width: "100%" }}>
                <AgGridReact
                    // rowData={rowData}
                    columnDefs={columnDefs}

                    defaultColDef={defaultColDef}
                    animateRows={true}

                    rowSelection='multiple'
                    // onSelectionChanged={onSelectionChanged}
                    rowMultiSelectWithClick={true}   //Select Multi Rows With Click

                    // onCellClicked={cellClickedListener}

                    onGridReady={onGridReady}
                    enableBrowserTooltips={true}

                    pagination={true}
                // paginationPageSize= {30}
                // paginationAutoPageSize= {true}
                />
            </div>
        </div>
    );
}

export default App;