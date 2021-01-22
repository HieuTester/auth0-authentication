import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Layout } from 'antd';
import 'antd/dist/antd.css'
import { NavBar, Loading } from "./components";
import { Home, Profile, ExternalApi } from "./views";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./auth/protected-route";

import "./app.css";

const App = () => {

  const {  Footer } = Layout;
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <Container className="flex-grow-1 mt-5">
        <Switch>
          <Route path="/" exact component={Home} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/external-api" component={ExternalApi} />
        </Switch>
      </Container>
      <Footer > HieuTt01 © 2 0 2 1</Footer>
    </div>
  );
};

export default App;
