import React, { useCallback, useState, useMemo } from "react";
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";

export const ScheduleTables = React.memo(() => {
  const { getTableIds, addTable, removeTable } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const tableIds = useMemo(() => getTableIds(), [getTableIds]);

  const handleAddTable = useCallback(() => {
    addTable();
  }, [addTable]);

  const handleRemoveTable = useCallback((targetId: string) => {
    removeTable(targetId);
  }, [removeTable]);

  const handleSearchInfoSet = useCallback((tableId: string, day?: string, time?: number) => {
    setSearchInfo({ tableId, day, time });
  }, []);

  const handleSearchInfoClose = useCallback(() => {
    setSearchInfo(null);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
              <ButtonGroup size="sm" isAttached>
                <Button colorScheme="green" onClick={() => handleSearchInfoSet(tableId)}>시간표 추가</Button>
                <Button colorScheme="green" mx="1px" onClick={handleAddTable}>복제</Button>
                <Button colorScheme="green" isDisabled={tableIds.length === 1}
                        onClick={() => handleRemoveTable(tableId)}>삭제</Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              key={`schedule-table-${tableId}`}
              tableId={tableId}
              onScheduleTimeClick={(timeInfo) => handleSearchInfoSet(tableId, timeInfo.day, timeInfo.time)}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleSearchInfoClose}/>
    </>
  );
});