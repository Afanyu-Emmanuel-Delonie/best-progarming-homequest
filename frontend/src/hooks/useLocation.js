import { useState, useEffect } from "react"
import { locationService } from "../services/locationService"

const EMPTY_LIST = []

export function useLocationPicker() {
  const [provinces, setProvinces] = useState(EMPTY_LIST)
  const [districts, setDistricts] = useState(EMPTY_LIST)
  const [sectors,   setSectors]   = useState(EMPTY_LIST)
  const [cells,     setCells]     = useState(EMPTY_LIST)
  const [villages,  setVillages]  = useState(EMPTY_LIST)

  const [location, setLocation] = useState({
    provinceCode: "", districtCode: "", sectorCode: "", cellCode: "", villageCode: "",
  })

  // Load provinces once
  useEffect(() => {
    locationService.getProvinces().then(setProvinces).catch(() => {})
  }, [])

  const pick = (level, code) => {
    switch (level) {
      case "province":
        setLocation({ provinceCode: code, districtCode: "", sectorCode: "", cellCode: "", villageCode: "" })
        setDistricts(EMPTY_LIST); setSectors(EMPTY_LIST); setCells(EMPTY_LIST); setVillages(EMPTY_LIST)
        if (code) locationService.getChildren(code).then(setDistricts).catch(() => {})
        break
      case "district":
        setLocation(l => ({ ...l, districtCode: code, sectorCode: "", cellCode: "", villageCode: "" }))
        setSectors(EMPTY_LIST); setCells(EMPTY_LIST); setVillages(EMPTY_LIST)
        if (code) locationService.getChildren(code).then(setSectors).catch(() => {})
        break
      case "sector":
        setLocation(l => ({ ...l, sectorCode: code, cellCode: "", villageCode: "" }))
        setCells(EMPTY_LIST); setVillages(EMPTY_LIST)
        if (code) locationService.getChildren(code).then(setCells).catch(() => {})
        break
      case "cell":
        setLocation(l => ({ ...l, cellCode: code, villageCode: "" }))
        setVillages(EMPTY_LIST)
        if (code) locationService.getChildren(code).then(setVillages).catch(() => {})
        break
      case "village":
        setLocation(l => ({ ...l, villageCode: code }))
        break
    }
  }

  return { location, provinces, districts, sectors, cells, villages, pick }
}
