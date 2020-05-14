'use strict';

// const app = async () => {
//     try {
//         setInterval(async () => {
//             // Fetch your data from the server
//             const httpResponse = await fetch('http://localhost:5000/api/flags');
//             // Your HTTP response body is json, so parse it into a JavaScript object
//             const responseObject = await httpResponse.json();
//             // Use JQuery to get the table element from the DOM
//             const table_flags = $('#my-table-flags');
//             // Clear the current contents of the table
//             table_flags.empty();

//             // Iterate over each FLAG in the response, and do something with it ...
//             responseObject.flags.forEach(row => {
//                 // For each FLAG, append a new row to the table
//                 if (row.flag === 'RED') {
//                     table_flags.append(`<tr bgcolor="#FF0000" class="table-row"><td class="row-id">${row.flag}</td><td class="row-title">${row.message}</td><td class="row-data">${row.guidQuery}</td><td class="row-data1"><a href="http://www.cnn.com">${row.graphInternalId}</a></td></tr></div>`,);		
//                 } else if (row.flag === 'YELLOW') {
//                     table_flags.append(`<tr bgcolor="#FFFF00" class="table-row"><td class="row-id">${row.flag}</td><td class="row-title">${row.message}</td><td class="row-data">${row.guidQuery}</td><td class="row-data1"><a href="http://www.cnn.com">${row.graphInternalId}</a></td></tr></div>`,);
//                 } else {
//                     table_flags.append(`<tr class="table-row"><td class="row-id">${row.flag}</td><td class="row-title">${row.message}</td><td class="row-data">${row.guidQuery}</td><td class="row-data1"><a href="http://www.cnn.com">${row.graphInternalId}</a></td></tr></div>`,);
//                 };
//             });;
//             // Optionally, you may want to iterate over the stats as well ...
//             const table_stats = $('#my-table-stats');
//             table_stats.empty();
//             responseObject.stats.forEach(row => {
//                 table_stats.append(`<tr class="table-row"><td class="row-id">${row.totalitems}</td></tr>`,);
//                 table_stats.append(`<tr class="table-row"><td class="row-id">${row.totaladdresses}</td></tr>`,);
//             });;
//         },2000);
//     } catch (error) {
//         console.error(error);
//     }
// };

// window.addEventListener('load', app);

const { Table, Popup, List, Icon, Checkbox, Button, Message } = semanticUIReact;

const CASE_ID = '8196cfb258774c7c8b8ef258ff0e088d';
const GRAPH_URL = `http://xcorplabs.eastus.cloudapp.azure.com:8999/cases/${CASE_ID}/graph`;

/**
 * Create a link to Investigate Graph which renders the vertexIds
 *
 * @param {string} encodedVertexIds
 * @returns {string}
 */
const createGraphHref = (encodedVertexIds) => `${GRAPH_URL}?vertexIds=${encodedVertexIds}`;

/**
 * URL encode the graph internal id
 *
 * @param {string} graphInternalId
 * @returns {string}
 */
const encodeGraphInternalId = (graphInternalId) => graphInternalId
	.split(',')
	.map(id => encodeURI(id))
	.join(',');

const App = () => {
    const [results, setResults] = React.useState([]);
    const [stats, setStats] = React.useState([]);
	
	const [checkedItems, setCheckedItems] = React.useState([]);
	
	const resetCheckedItems = () => setCheckedItems([]);

    React.useEffect(() => {
        const intervalId = setInterval(async () => {
            // Fetch your data from the server
            const httpResponse = await fetch('http://xcorplabs.eastus.cloudapp.azure.com:5000/api/flags');
            const newResults = await httpResponse.json();
			
			if (
				(results.length !== newResults.flags.length) ||
				results.some(r => newResults.flags.every(nr => nr.graphInternalId !== r.graphInternalId))
			) setCheckedItems([]);
			
			setResults(newResults.flags);
            setStats(newResults.stats);
        }, 2000);
		
		return () => clearInterval(intervalId);
    }, [results]);
	
	const sendAllHref = createGraphHref(
		results
		    .filter(r => checkedItems.includes(r.row))
            .map(r => encodeGraphInternalId(r.graphInternalId))
			.join(',')
	);

    return (
        <div style={{ padding: 40 }}>
            <h3>Nuix Risk Score</h3>
            {results.length > 0 ? (
				<>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Row</Table.HeaderCell>
								<Table.HeaderCell>Selection</Table.HeaderCell>
								<Table.HeaderCell>Alert Message</Table.HeaderCell>
								<Table.HeaderCell># of Vertices</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{results.map(result => {
								
								const isCurrentResultChecked = checkedItems.includes(result.row);
								
								const handleToggleItem = () => {
									isCurrentResultChecked
										? setCheckedItems(checkedItems.filter(i => i !== result.row))
										: setCheckedItems([...checkedItems, result.row]);
								}
								
								return (
									<Table.Row 
										key={result.row}
									>
										<Table.Cell>
											<Icon name='id badge outline' /> {result.row}
										</Table.Cell>
										<Table.Cell>
											<Checkbox toggle checked={isCurrentResultChecked} onChange={handleToggleItem} />
										</Table.Cell>
										<Table.Cell>
											<Popup
												content={
													<List divided>
														{result.graphInternalId.split(',').map(graphInternalId => (
															<List.Item key={graphInternalId}>{graphInternalId}</List.Item>
														))}
													</List>
												}
												key={result.row}
												header={<div>IDS on the path</div>}
												trigger={
													<a
														href={createGraphHref(encodeGraphInternalId(result.graphInternalId))}
														target='_blank'
													>
														{result.message}
													</a>
												}
											/>
										</Table.Cell>
										<Table.Cell>
											{result.graphInternalId.split(',').length}
										</Table.Cell>
										<Table.Cell>
											<Icon
												color={result.flag.toLowerCase()}
												name='warning circle'
											/>
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table>
					<div>
						<Button
							primary
							icon
							as="a"
							target="_blank"
							disabled={checkedItems.length === 0}
							href={sendAllHref}
						>
							<Icon name="code branch" />
							&nbsp;Send {checkedItems.length ? `${checkedItems.length} rows ` : ''}to Graph
						</Button>
						<Button
							secondary
							floated="right"
							icon
							disabled={checkedItems.length === 0}
							onClick={() => resetCheckedItems()}
						>
							<Icon name="refresh" />
							&nbsp;Reset
						</Button>
					</div>
				</>
            ) : (
                <Icon name='spinner' loading />
            )}
        </div>
    );
};

ReactDOM.render(<App name='Nuix Risk Score' />, document.getElementById('root'));