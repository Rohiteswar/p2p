import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Features from './components/Features'
import ContractExplorer from './components/ContractExplorer'
import LiveFeed from './components/LiveFeed'
import Simulation from './components/Simulation'
import Quickstart from './components/Quickstart'
import Footer from './components/Footer'
import ApiTester from './pages/ApiTester'

function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <ContractExplorer />
      <LiveFeed />
      <Simulation />
      <Quickstart />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<HomePage />} />
      <Route path="/api-tester"  element={<ApiTester />} />
    </Routes>
  )
}
