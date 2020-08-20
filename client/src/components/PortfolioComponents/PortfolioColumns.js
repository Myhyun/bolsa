import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Table } from "react-bootstrap";
import UserChart from "../UserComponents/UserChart";
import UserPortfolioValue from "../UserComponents/UserPortfolioValue";
import UserStocks from "../UserComponents/UserStocks";
import UserShares from "../UserComponents/UserShares";
import UserSharesPrice from "../UserComponents/UserSharesPrice";
import UserBalance from "../UserComponents/UserBalance";
import InputBalance from "../InputBalance";
import "./columns.css";
import API from "../../utils/API"

function PortfolioColumns(props) {
    let [stocks, setStocks] = useState([]);
    let [price, setPrice] = useState({});
    useEffect(() => {
        console.log(props.username);
        API.getUserStocks(props.username).then((results) => {
            setStocks(results.data);
            let priceObj;
            for (let i = 0; i < results.data.length; i++) {
                API.getStockBySymbol(results.data[i].symbol).then((response) => {
                    priceObj = { ...priceObj, [results.data[i].symbol]: response.data.c }
                    setPrice(priceObj);
                }).catch((error) => { console.log(error) })
            };
        }).catch((error) => console.log(error));
    }, []);

    return (
        <div>
            <Container>
                <h2 className="mt-3 text-center">Your Portfolio</h2>
                <Row className = "mt-4">
                    <Col sm={6} md={5} lg={4} xl={5} className = "column1">
                        <h3 className="mt-3 text-center">
                            $ <UserPortfolioValue price={price} /> Invested
                        </h3>
                        <h2 className="mt-3 text-center">
                            Total Balance
                        </h2>
                        <h3 className="mt-3 text-center">
                            <UserBalance />
                        </h3>
                        <div>
                            <InputBalance />
                        </div>
                    </Col>
                    <Col sm={6} md={7} lg={8} xl={7} className = "column2">
                        <h3 className= "mt-3 text-center">Portfolio Distribution</h3>
                        <div className="mt-4 text-center">
                            <UserChart stocks={stocks} />
                        </div>
                        <Card className="mt-3 portfolioCont">
                            <Container>
                                <Card.Body>
                                    <Row>
                                        <Table>
                                            <thead>
                                                <tr className="trPortfolio">
                                                    <th>Stock Name</th>
                                                    <th># of Shares</th>
                                                    <th>Value of Shares</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stocks.map((item) => {
                                                    return (
                                                        <tr>
                                                            <td><UserStocks stockName={item.symbol} /></td>
                                                            <td><UserShares stockShares={item.amount} /></td>
                                                            <td><UserSharesPrice price={price[item.symbol]} /></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </Row>
                                </Card.Body>
                            </Container>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default PortfolioColumns;
