import './App.css';
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Tasks from './components/tasks';
import FinshTasks from './components/finsh-tasks';
import PaddingTasks from './components/padding-tasks';
import Header from './components/header';
import CreateOrg from './components/create-org';
import AddAgent from './components/add-agent';
import AddChecklist from './components/add-checklist';
import AddClient from './components/add-client';
import Task from './components/task';
import AdminPage from './components/admin-page';
import PrivateRoute from './components/PrivateRoute';
import CreateOrgAdmin from './components/create-org-admin';
import CreateSchedule from './components/create-schedule';
import AddCategory from './components/add-category';
import Check from './components/check';
import Checklists from './components/checklists';
import EditChecklist from './components/edit-checklist';
import AgentsMap from './components/map';
function App() {
  return (
    <div>
      <HashRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='*' element={<h2>Page Not Found</h2>} />
          <Route path='/admin-page' element={<PrivateRoute component={AdminPage} role={0} />} />
          <Route path='/create-org-admin' element={<PrivateRoute component={CreateOrgAdmin} role={0} />} />
          <Route path='/tasks' element={<PrivateRoute component={Tasks} role={1} />} />
          <Route path='/map' element={<PrivateRoute component={AgentsMap} role={1} />} />
          <Route path='/tasks/task/:taskId' element={<PrivateRoute component={Task} role={1} />} />
          <Route path='/tasks/check/:checkId/:type' element={<PrivateRoute component={Check} role={1} />} />
          <Route path='/add-category' element={<PrivateRoute component={AddCategory} role={0} />} />
          <Route path='/create-org' element={<PrivateRoute component={CreateOrg} role={0} />} />
          <Route path='/add-agent' element={<PrivateRoute component={AddAgent} role={1} />} />
          <Route path='/add-client' element={<PrivateRoute component={AddClient} role={1} />} />
          <Route path='/checklists' element={<PrivateRoute component={Checklists} role={1} />} />
          <Route path='/checklists/add-checklist' element={<PrivateRoute component={AddChecklist} role={1} />} />
          <Route path='/checklists/edit-checklist/:listId' element={<PrivateRoute component={EditChecklist} role={1} />} />
          <Route path='/create-schedule' element={<PrivateRoute component={CreateSchedule} role={1} />} />
          <Route path='/logout' element={<Login />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
