// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    FormControl,
    VStack,
    Text,
    FormHelperText,
    FormLabel,
    UseDisclosureProps,
    HStack,
    Box,
    useColorModeValue,
    Divider,
    Input,
    InputRightElement,
    InputGroup,
} from '@chakra-ui/react';
import { BigNumber, constants, ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalOverlay,
} from '../../Modal';

interface INodeBalanceModalProps {
    userBalance: BigNumber;
    disclosure: UseDisclosureProps;
    onDepositFunds: (funds: BigNumber) => void;
}

export const NodeBalanceModal: FC<INodeBalanceModalProps> = ({
    userBalance,
    disclosure,
    onDepositFunds,
}) => {
    if (!userBalance) return null;

    const { isOpen, onClose } = disclosure;
    const [output, setOutput] = useState<BigNumber>(constants.Zero);
    const [fundsValue, setFundsValue] = useState<any>(0);

    const inputFocusRef = useRef();
    const bg = useColorModeValue('gray.50', 'header');

    const toBigNumber = (value: number, decimals = 18) =>
        ethers.utils.parseUnits(value.toString(), decimals);

    const toETH = (value: BigNumber) => {
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        };

        const numberFormat = new Intl.NumberFormat('en-US', options);
        const valueFormatted = numberFormat.format(
            value ? parseFloat(formatUnits(value, 18)) : 0
        );

        return valueFormatted;
    };

    const userETHBalance = toETH(userBalance);

    useEffect(() => {
        if (!isOpen) {
            setFundsValue(0);
            setOutput(constants.Zero);
        }
    }, [isOpen]);

    useEffect(() => {
        try {
            const funds = parseFloat(fundsValue);
            setOutput(toBigNumber(funds)); // ETH float to BigNumber
        } catch {
            setOutput(constants.Zero);
        }
    }, [fundsValue]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
                initialFocusRef={inputFocusRef}
            >
                <ModalOverlay />
                <ModalContent>
                    <Box pb={6}>
                        <HStack justify="space-between">
                            <Box
                                fontSize="xl"
                                fontWeight="bold"
                                p={4}
                                pl={8}
                                pb={4}
                            >
                                Node balance
                            </Box>

                            <ModalCloseButton pt={2} mt={5} />
                        </HStack>
                        <Divider />
                    </Box>
                    <ModalBody>
                        <VStack spacing={5}>
                            <Text>
                                You incur transaction fee expenses when you are
                                rewarded with CTSI. Expect to spend around
                                120,000 gas every time your node produces a
                                block.
                            </Text>
                            <FormControl id="stakeAmount">
                                <HStack justify="space-between">
                                    <FormLabel fontWeight="bold">
                                        Node balance
                                    </FormLabel>
                                </HStack>
                                <InputGroup>
                                    <Input
                                        value={fundsValue}
                                        onChange={(e) =>
                                            setFundsValue(e.target.value)
                                        }
                                    />
                                    <InputRightElement
                                        color="gray.300"
                                        size="lg"
                                        pointerEvents="none"
                                        w={12}
                                        h="100%"
                                        children={<Box>ETH</Box>}
                                    />
                                </InputGroup>
                                <FormHelperText>
                                    Your balance: {userETHBalance} ETH
                                </FormHelperText>
                            </FormControl>
                        </VStack>
                        <ModalFooter px="0" pt={10}>
                            <VStack w="full" spacing={4}>
                                <Button
                                    isFullWidth
                                    colorScheme="blue"
                                    disabled={output.isZero()}
                                    onClick={() => {
                                        onDepositFunds(output);
                                        disclosure.onClose();
                                        onClose();
                                    }}
                                >
                                    ADD FUNDS
                                </Button>
                                <Button isFullWidth bg={bg} onClick={onClose}>
                                    CANCEL
                                </Button>
                            </VStack>
                        </ModalFooter>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
