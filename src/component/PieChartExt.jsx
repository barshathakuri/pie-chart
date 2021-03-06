import axios from 'axios';
import React, { PureComponent } from 'react';
import {
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const orgApiUri = "https://mdsa.bipad.gov.np/api/v1/organization";
const projApiUri = "https://mdsa.bipad.gov.np/api/v1/project";

class PieChartExt extends PureComponent {

  constructor(props) {
      super(props);
      this.state = {data:[]};
    }

    componentDidMount() {
      this.fetchData();
    }

    fetchData(){
      let chartData = [];

      axios.get(orgApiUri).then((orgData) => {  // fetch organization names

        const allOrgs = orgData.data.results.map((dt) => ({"oid": dt.oid, "name":dt.oname})); // select org id and name from response

         axios.get(projApiUri).then((projectData) =>{ // fetch Proj data

         const projGroupByOid = projectData.data.results.reduce((acc, it) => (acc[it.oid] = (acc[it.oid] || 0) + 1, acc), {}); // count proj per organization

         const orgsWithProjs =  Object.keys(projGroupByOid); // ["2", "6"]

         orgsWithProjs.forEach((key, idx) => { 
            let dt = {
              "oid": key,
              "value":projGroupByOid[key],
              "name": allOrgs.filter((orgInfo) => orgInfo.oid == key).map((org) => (org.name))[0]
            };
            chartData.push(dt);
          });
          this.setState({data:chartData});
        }).catch((e) => {console.log(e)});

      }).catch((err) => console.log(err));
    }

  render() {
    return (
      <PieChart width={400} height={400}>
        
        <Pie data={this.state.data} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" label>
        {
            this.state.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
        }
        </Pie>
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    );
  }
}

export default PieChartExt;
