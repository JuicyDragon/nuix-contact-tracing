'use strict';

const { Table, Popup, List, Icon, Checkbox, Button, Message } = semanticUIReact;

const CASE_ID = '8196cfb258774c7c8b8ef258ff0e088d';
// For Localhost
const STOPLIGHT_SERVER_URL = 'http://localhost:5000/api/flags'
// For Azure Instance
//const STOPLIGHT_SERVER_URL = 'http://xcorplabs.eastus.cloudapp.azure.com:5000/api/flags'
const INVESTIGATE_URL = 'http://xcorplabs.eastus.cloudapp.azure.com';
const INVESTIGATE_PORT = '8999';
const GRAPH_URL = `${INVESTIGATE_URL}:${INVESTIGATE_PORT}/cases/${CASE_ID}/graph`;
const GRID_URL = `${INVESTIGATE_URL}:${INVESTIGATE_PORT}/cases/${CASE_ID}/search/grid`;

/**
 * Create a link to Investigate Graph which renders the vertexIds
 *
 * @param {string} encodedVertexIds
 * @returns {string}
 */
const createGraphHref = (encodedVertexIds) => `${GRAPH_URL}?vertexIds=${encodedVertexIds}`;

/**
 * Create a link to Investigate Grid which renders the ids in the search grid
 *
 * @param {string} ids
 * @returns {string}
 */
const createGridHref = (ids) =>
  `${GRID_URL}?gridIds=${ids}`;

/**
 * URL encode the graph internal id or guid query string (both are strings with comma separated ids)
 *
 * @param {string} stringOfIds
 * @returns {string}
 */
const encodeIdString = (stringOfIds) => stringOfIds
	.split(',')
	.map(id => encodeURI(id))
	.join(',');

const App = () => {
	const [results, setResults] = React.useState([]);
	const [stats, setStats] = React.useState([]);
	const [addresses, setAddresses] = React.useState([]);

	const [checkedItems, setCheckedItems] = React.useState([]);

	const resetCheckedItems = () => setCheckedItems([]);

	React.useEffect(() => {
		const intervalId = setInterval(async () => {
			// Fetch your data from the server
			const httpResponse = await fetch(STOPLIGHT_SERVER_URL);
			const newResults = await httpResponse.json();

			if (
				(results.length !== newResults.flags.length) ||
				results.some(r => newResults.flags.every(nr => nr.graphInternalId !== r.graphInternalId))
			) setCheckedItems([]);

			setResults(newResults.flags);
			setStats(newResults.stats);
			setAddresses(newResults.addresses);
		}, 2000);

		return () => clearInterval(intervalId);
	}, [results]);

	const sendAllHref = createGraphHref(
		results
			.filter(r => checkedItems.includes(r.row))
			.map(r => encodeIdString(r.graphInternalId))
			.join(',')
	);

	const sendAllGridHref = createGridHref(
		results
			.filter(r => checkedItems.includes(r.row))
			.map(r => encodeIdString(r.guidQuery))
			.join(","),
	);

	return (
		<div style={{ padding: 40 }}>
			<h3>Nuix Risk Score</h3>
			{
				(stats.length > 0) && (
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Source Data Set Statistics</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell>
									{stats[0].totaladdresses}
								</Table.Cell>
							</Table.Row>
							<Table.Row >
								<Table.Cell>
									{stats[0].totalitems}
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				)
			}

			{results.length > 0 ? (
				<>
					<Table celled>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Row</Table.HeaderCell>
								<Table.HeaderCell>Selection</Table.HeaderCell>
								<Table.HeaderCell>View Relationships in Canvas</Table.HeaderCell>
								<Table.HeaderCell># of Vertices</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>View Items in Search</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
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
														href={createGraphHref(encodeIdString(result.graphInternalId))}
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
										<Table.Cell style={{ wordWrap: 'break-word', maxWidth: 400 }}>
											{result.guidQuery}
										</Table.Cell>
										<Table.Cell>
											<Button
												disabled={!result.graphInternalId || !result.graphInternalId.length}
												as="a"
												href={createGraphHref(
													encodeIdString(result.graphInternalId),
												)}
												target="_blank"
												rel="noopener noreferrer"
												icon
												title="Send to the Graph"
											>
												<Icon name="code branch" />
											</Button>
											<Button
												disabled={!result.guidQuery || !result.guidQuery.length}
												as="a"
												href={createGridHref(
													encodeIdString(result.guidQuery),
												)}
												target="_blank"
												rel="noopener noreferrer"
												icon
												title="Send to the Grid"
											>
												<Icon name="grid layout" />
											</Button>
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table>
					{
						(addresses.length > 0) && (
							<Table celled>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell>Addresses & Phone Numbers Scanned </Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									<Table.Row>
										<Table.Cell>
											{addresses[0].addressesCount}
										</Table.Cell>
									</Table.Row>
									<Table.Row>
										<Table.Cell>
											{addresses[0].addresses}
										</Table.Cell>
									</Table.Row>
								</Table.Body>
							</Table>
						)
					}
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
							primary
							icon
							as="a"
							target="_blank"
							rel="noopener noreferrer"
							disabled={checkedItems.length === 0}
							href={sendAllGridHref}
						>
							<Icon name="grid layout" />
							&nbsp;Send {checkedItems.length ? `${checkedItems.length} rows ` : ""}
							to Grid
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