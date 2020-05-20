require 'net/http'
require 'uri'
require 'json'
require 'java'

def geolocate(address, apiKey, item)
	uri = URI.parse('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + apiKey)
	https = Net::HTTP.new(uri.host, uri.port)
	https.use_ssl=true
	begin
		request = Net::HTTP::Get.new(uri.request_uri)
		response = https.request(request)
		payload = JSON.parse(response.body)
		results = payload["results"]
		status = payload["status"]
		
		if status != "OK"
			return "status=#{status}"
		end
		custom_metadata = item.getCustomMetadata
		formattedAddress = results[0]["formatted_address"] #todo: update to support multiple locations
		lat = results[0]["geometry"]["location"]["lat"]
		custom_metadata.putFloat("Latitude",lat)
		lng = results[0]["geometry"]["location"]["lng"]
		custom_metadata.putFloat("Longitude",lng)
		out = Hash.new
		out["address"] = formattedAddress
		out["lat"] = lat
		out["lng"]= lng
		return out
	rescue => ex
		puts "ERROR: #{ex.message}"
	end
end


#address = '4108+Hain+Drive+Lafayette+Hill,PA+19444'
key = 'AIzaSyBCond6OMDJ5dO-ypZ8Zbn6OFJXnx8wQQM'

currentSelectedItems.each do |item|
	homeStreetName = item.getProperties['homeStreetName']
	homeCity = item.getProperties['homeCity']
	homeState = item.getProperties['homeState']
	homeZip = item.getProperties['homeZip']
	completeAddress = "#{homeStreetName}, #{homeCity}, #{homeState} #{homeZip}"
	puts completeAddress.gsub(' ','+')
	puts geolocate(completeAddress, key, item)
end

