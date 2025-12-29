"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { fetchScorecardById } from "@/service/report";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AccidentDialog from "../add/AccidentDialog";
import IssuesDialog from "../add/IssuesDialog";
import EscalationDialog from "../add/EscalationDialog";
import { Button } from "@/components/ui/button";

function AccidentDetail() {
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trip, setTrip] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown visibility
  // Dialog visibility states
  const [dialogState, setDialogState] = useState({
    accident: false,
    issues: false,
    escalation: false,
  });
  const [selectedOption, setSelectedOption] = useState("");

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (value) => {
    console.log("Selected option:", value);
    setSelectedOption(""); // Reset to placeholder
    setIsDropdownOpen(false); // Close dropdown
    setDialogState({
      accident: value === "accident",
      issues: value === "issues",
      escalation: value === "escalation",
    });
  };

  // Close handler for dialogs
  const handleCloseDialog = () => {
    setDialogState({
      accident: false,
      issues: false,
      escalation: false,
    });
  };

  useEffect(() => {
    const getScorecard = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error("No asset ID provided");
        }

        const data = await fetchScorecardById(id);
        console.log("scorecard details:", data);
        console.log("data type:", typeof data, "isArray:", Array.isArray(data));

        let scorecardData;
        if (Array.isArray(data)) {
          if (data.length === 0) {
            throw new Error("No asset data found for this ID");
          }
          scorecardData = data[0];
        } else if (data && typeof data === "object") {
          scorecardData = data;
        } else {
          throw new Error("Invalid scorecard data format");
        }

        console.log("Setting trip with scorecardData:", scorecardData);
        setTrip({
          ...scorecardData,
          driver_name: scorecardData.driver_name?.trim() || "Unknown Driver",
        });
      } catch (err) {
        console.error("Error fetching scorecard:", err);
        setError(err.message || "Failed to fetch scorecard details");
      } finally {
        setLoading(false);
      }
    };

    getScorecard();
  }, [id]);

  useEffect(() => {
    console.log("trip state updated:", trip);
    if (trip) {
      console.log("trip.driver_name:", trip.driver_name);
    }
  }, [trip]);

  if (loading) {
    return <div className="text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!trip) {
    return <div className="text-black">No scorecard data available.</div>;
  }

  return (
    <div>
      <Header />
      <div className="pt-5 px-2 w-full">
        <div className="w-full flex justify-between">
          <div>
            <p className="text-black font-medium pt-1">Scorecard Details</p>
          </div>
          <div className="relative">
            <Button
              className="bg-black text-white border border-neutral-300 hover:bg-neutral-100 hover:text-black text-[13px] font-normal"
              onClick={handleAddClick}
            >
              Add scorecard detail
            </Button>
            {isDropdownOpen && (
              <div className="absolute top-10 right-0 bg-white border border-neutral-300 rounded-md shadow-lg z-10">
                <select
                  className="p-2 text-black rounded-md text-sm w-48"
                  value={selectedOption}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    handleOptionSelect(e.target.value);
                  }}
                  
                >
                  <option value="" disabled>
                    Select report type
                  </option>
                  <option value="accident">Add Accident</option>
                  <option value="issues">Add Issues</option>
                  <option value="escalation">Add Escalation</option>
                </select>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 py-5 px-10 bg-white rounded-md uppercase">
          <div className="border-b pb-5">
            <p className="text-black font-medium text-sm">{trip.driver_name}</p>
          </div>
          <div className="pt-5">
            <p className="text-black font-medium text-[13px]">Basic Details</p>
            <div className="w-[80%] grid grid-cols-5 gap-x-5 pt-5">
              <div>
                <p className="text-neutral-600 font-medium text-xs">
                  Average Score
                </p>
                <p className="text-black font-medium text-sm pt-1">
                  {trip.average_score ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium text-xs">
                  Weighted Score
                </p>
                <p className="text-black font-medium text-sm pt-1">
                  {trip.weighted_score ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium text-xs">
                  Total Issues
                </p>
                <p className="text-black font-medium text-sm pt-1">
                  {trip.total_issues ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium text-xs">
                  Total Escalations
                </p>
                <p className="text-black font-medium text-sm pt-1">
                  {trip.total_escalations ?? "N/A"}
                </p>
              </div>
              <div>
                <p className="text-neutral-600 font-medium text-xs">
                  Total Accidents
                </p>
                <p className="text-black font-medium text-sm pt-1">
                  {trip.total_accidents ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-10">
        <div className="mt-5 border-t">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="trip-scores">
              <AccordionTrigger className="text-black">
                Trip Scores Table
              </AccordionTrigger>
              <AccordionContent>
                {trip?.trip_scores && trip.trip_scores.length > 0 ? (
                  <Table className="text-black">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trip ID</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className=''>
                      {trip.trip_scores.map((score) => (
                        <TableRow key={score.id} className="h-12">
                          <TableCell>{score.trip_id ?? "N/A"}</TableCell>
                          <TableCell>{score.score ?? "N/A"}</TableCell>
                          <TableCell>{score.comments ?? "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-black">No trip scores available.</p>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="accidents">
              <AccordionTrigger className="text-black">
                Accidents Table
              </AccordionTrigger>
              <AccordionContent>
                {trip?.accidents && trip.accidents.length > 0 ? (
                  <Table className="text-black">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trip.accidents.map((accident) => (
                        <TableRow key={accident.id} className="h-12">
                          <TableCell>{accident.description ?? "N/A"}</TableCell>
                          <TableCell>{accident.location ?? "N/A"}</TableCell>
                          <TableCell>{accident.severity ?? "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-black">No accident data available.</p>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="issues">
              <AccordionTrigger className="text-black">
                Issues Table
              </AccordionTrigger>
              <AccordionContent>
                {trip?.issues && trip.issues.length > 0 ? (
                  <Table className="text-black">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trip.issues.map((issue) => (
                        <TableRow key={issue.id} className="h-12">
                          <TableCell>{issue.description ?? "N/A"}</TableCell>
                          <TableCell>{issue.type ?? "N/A"}</TableCell>
                          <TableCell>{issue.severity ?? "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-black">No issues found.</p>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="escalations">
              <AccordionTrigger className="text-black">
                Escalations Table
              </AccordionTrigger>
              <AccordionContent>
                {trip?.escalations && trip.escalations.length > 0 ? (
                  <Table className="text-black">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Issue ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trip.escalations.map((escalation) => (
                        <TableRow key={escalation.id} className="h-12">
                          <TableCell>{escalation.reason ?? "N/A"}</TableCell>
                          <TableCell>{escalation.status ?? "N/A"}</TableCell>
                          <TableCell>{escalation.issue_id ?? "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-black">No escalations found.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        </div>
      </div>
      {/* Dialog Components */}
      <AccidentDialog
        isOpen={dialogState.accident}
        onClose={handleCloseDialog}
        id={id}
      />
      <IssuesDialog
        id={id}
        isOpen={dialogState.issues}
        onClose={handleCloseDialog}
      />
      <EscalationDialog
        isOpen={dialogState.escalation}
        onClose={handleCloseDialog}
        id={id}
      />
    </div>
  );
}

export default AccidentDetail;
