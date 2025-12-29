//export const login = 'master/Driverlogin' //login
export const login = 'staff/login' //login

//dashboard
export const tripCompleted = 'master/trip/Completed' //total completed trip
export const completedTripPercentage = 'master/trip/PercentComplete' //completed trip percentage
export const tripOngoing = 'master/trip/ongoing' //total ongoing trip
export const onGoingTripPercentage = 'master/trip/Percentongoing' //onging trip percentage
export const triPending = 'master/trip/pending' //total pending trip
export const triPendingPercentage = 'master/trip/PercentPending' //pending trip percentage
export const nOfTruck = 'master/truck/total' //total truck
export const nOfDriver = 'master/driver/totalDrivers' //total driver
export const graphProfitByYear = 'master/trip/ProfitCompare' //graph by year

//Procurement
export const getSupplier = 'master/client/fetchAll' //fetch all supplier
export const addSupplier = 'master/client/add' //add supplier
export const getSupplierById = 'master/client/get' //get supplier by id

export const addProduct = 'master/purchase/addproduct' //add product
export const getProduct = 'master/purchase/fetchAllproduct' //get product

export const getHSNByProduct = 'master/purchase/getproduct' //get HSN by product
export const getVarity = 'master/purchase/fetchAllvariety' //get variety
export const getVarityById = 'master/purchase/getvarietyByproduct' //get variety by id
export const addVarity = 'master/purchase/addvariety' //add variety

export const getUnits = 'master/purchase/fetchAllunits' //fetch unit
export const addUnit = 'master/purchase/addunit' //add unit

export const addPurchase = "master/purchase/add"//create purchase
export const fetchPurchase = "master/purchase/fetchAll"//fetch purchase
export const searchPurchase = 'master/purchase/search' //search purchase
export const getPurchaseByUIN = 'master/purchase/getByuin' //get purchase by UIN ID
export const updatePurchaseStatus = 'master/purchase/approval' //update purchase status
export const updatePurchase = 'master/purchase/update' //update purchase

export const addCountry = 'master/country/add' //add country
export const getCountry = 'master/country/fetchall' //fetch all countries

export const getTerms = 'master/inco/fetchallterms' //fetch all inco terms

export const getModes = 'master/inco/fetchallmodes' //fetch all modes

export const addPort = 'master/port/add' //add port
export const getPorts = 'master/port/fetchAll' //fetch all ports


//booking
export const getDetailsByUinId = 'master/purchase/getByuin' //fetch details by uin id
export const getBookingByUinId = 'master/booking/getByUin' //fetch booking by uin id
export const getBlType = 'master/booking/fetchAllBltype' //fetch all bl type

export const addBooking = 'master/booking/add' //create booking
export const getBooking = 'master/booking/fetchAll' //fetchBooking
export const searchBooking = 'master/booking/search' //search booking
export const getBookingById = 'master/booking/get' //fetch booking by id

//fleet
export const addDriver = "master/driver/addDriver"//create driver
export const getDrivers = 'master/driver/fetchAllDriver'//fetch all drivers
export const getDriver = 'master/driver/fetchAllAvailableDriver'//fetch available driver
export const searchDriver ='master/driver/searchDriver' //driver search
export const getDriverById = 'master/driver/getDriver'// fetch driver by id
export const driverUpdate = 'master/driver/update' //update driver
export const driverDelete = 'master/driver/delete' //driver delete

export const getTruck = 'master/truck/fetchAllTruck'//fetch all truck
export const getThirdPartyTruck = 'fetchAll3rdpartyTruck' //fetch 3rd party truck
export const getAvailableTruck = 'master/truck/AllavailableVehicles' //fetch available truck
export const addTruck = 'master/truck/add'//create truck
export const searchTruck = 'master/truck/search' //truck search
export const getTruckById = 'master/truck/get' // fetch truck by id
export const updateTruck = 'master/truck/update' //truck update
export const truckDelete = 'master/truck/delete' //truck delete

export const addTrip = 'master/trip/create'//create trip
export const getTrip = 'master/trip/fetchAllTrip'//fetch trip
export const searchTripBydate = 'master/trip/filter' // search trip by date
export const searchTrip = 'master/trip/search' // search trip
export const getTripById = 'master/trip/get' //get trip by id
export const updatePayment = 'master/driver/paymentUpdate' //payment update
export const tripUpdate = 'master/trip/update' //update trip by id
export const tripStart = 'master/driver/startTrip' //start trip
export const tripDelete = 'master/trip/delete' //trip delete
export const tripEnd = 'master/driver/endTrip' //end trip
export const addStop = 'master/stop/create' //add stop
export const getStop = 'master/stop/fetchAll' //show stops
export const removeStop = 'master/stop/delete' //delete stops

export const getBranches = 'master/branch/getAll' //get all branches
export const addBranch = 'master/branch/create' //add branch
export const getHalting = 'master/slab/fetchAll' //get halting

//reports
export const fleetExpense = '/master/trip/truckExpense' //fleet expense
export const expenseSearch = 'master/trip/searchExpense' //expense search
export const fleetExpenseById = 'master/trip/truckExpenseById' //fleet expense by id
export const assetManagement = 'master/truck/fetchMaintenance' //asset Management
export const assetSearch = 'master/truck/searchMaintenance'//asset search
export const idle = 'master/truck/getVehicleIdle' //idle monitioring
export const idleSearch = 'master/truck/searchVehicleIdle' //idle search
export const service = 'master/truck/getServiceLog' //service log
export const serviceSearch = 'master/truck/searchServiceLog' //service search
export const insurance = 'master/trip/getInsurance-report' //insurance tracking
export const insuranceSearch = 'master/trip/searchInsurance-report' //insurance search
export const truckTracking = 'master/track/live-track' //truck tracking
export const truckTrackingSearch = 'master/track/search' //truck tracking search
export const containerTracking = 'master/trip/container-getAgeing' //container tracking
export const containerSearch = 'master/trip/searchcontainerAgeing' //container search
export const thirdParty = 'master/trip/getTruckUtilization-report' //fetch third party / own vehicle
export const thirdPartySearch = 'master/trip/SearchTruckUtilization' //search third party / own vehicle
export const reportTripSearch = 'master/trip/searchTrip' //search trip
export const accident = 'master/driver/getAllscorecard' //accident scorecard
export const scorecardById = 'master/driver/scorecard' //scorecard by id
export const addIssues = 'master/driver/addIssue' //add issue
export const addScore = "master/driver/addTrip-score" //add score
export const addAccident = 'master/driver/addAccident' //add accident
export const addExcalation = 'master/driver/addEscalation' //add excalation
export const getIssueById = 'master/driver/getIssuesbyid' //get issue by id
export const scorecardSearch = 'master/driver/searchAllscorecard' //scorecard search
export const searchTripLog = 'master/trip/filter' //filter trip log

export const stockBaseUrl='master/stock/fetchUrl';
