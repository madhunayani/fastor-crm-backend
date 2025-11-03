#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:3000"

# Initialize counters
PASSED=0
FAILED=0

# Helper function to print test results
print_test() {
    local test_name=$1
    local status=$2
    
    if [ "$status" == "PASS" ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $test_name"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}: $test_name"
        ((FAILED++))
    fi
}

echo -e "\n${YELLOW}==================================${NC}"
echo -e "${YELLOW}FASTOR CRM API - TEST SUITE${NC}"
echo -e "${YELLOW}==================================${NC}\n"

# ============ TEST 1: Root Endpoint ============
echo -e "${YELLOW}[TEST 1] Root Endpoint${NC}"
response=$(curl -s http://localhost:3000/)
if echo "$response" | grep -q "Fastor CRM API is running"; then
    print_test "Root endpoint returns success message" "PASS"
else
    print_test "Root endpoint returns success message" "FAIL"
fi

# ============ TEST 2: Register Employee 1 ============
echo -e "\n${YELLOW}[TEST 2] Employee Registration${NC}"
response=$(curl -s -X POST $BASE_URL/api/employees/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Counselor 1",
    "email": "counselor1@test.com",
    "password": "TestPassword123"
  }')

if echo "$response" | grep -q "Employee registered successfully"; then
    TOKEN1=$(echo "$response" | jq -r '.token' 2>/dev/null)
    print_test "Register employee 1" "PASS"
else
    print_test "Register employee 1" "FAIL"
fi

# ============ TEST 3: Register Employee 2 ============
response=$(curl -s -X POST $BASE_URL/api/employees/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Counselor 2",
    "email": "counselor2@test.com",
    "password": "TestPassword456"
  }')

if echo "$response" | grep -q "Employee registered successfully"; then
    TOKEN2=$(echo "$response" | jq -r '.token' 2>/dev/null)
    print_test "Register employee 2" "PASS"
else
    print_test "Register employee 2" "FAIL"
fi

# ============ TEST 4: Duplicate Email Registration ============
response=$(curl -s -X POST $BASE_URL/api/employees/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate User",
    "email": "counselor1@test.com",
    "password": "password123"
  }')

if echo "$response" | grep -q "Email address already registered"; then
    print_test "Duplicate email registration returns 409" "PASS"
else
    print_test "Duplicate email registration returns 409" "FAIL"
fi

# ============ TEST 5: Login with Correct Credentials ============
echo -e "\n${YELLOW}[TEST 3] Employee Login${NC}"
response=$(curl -s -X POST $BASE_URL/api/employees/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "counselor1@test.com",
    "password": "TestPassword123"
  }')

if echo "$response" | grep -q "Login successful"; then
    SAVED_TOKEN=$(echo "$response" | jq -r '.token' 2>/dev/null)
    print_test "Login with correct credentials" "PASS"
else
    print_test "Login with correct credentials" "FAIL"
fi

# ============ TEST 6: Login with Wrong Password ============
response=$(curl -s -X POST $BASE_URL/api/employees/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "counselor1@test.com",
    "password": "WrongPassword"
  }')

if echo "$response" | grep -q "Invalid email or password"; then
    print_test "Login with wrong password returns 401" "PASS"
else
    print_test "Login with wrong password returns 401" "FAIL"
fi

# ============ TEST 7: Submit Public Enquiry 1 ============
echo -e "\n${YELLOW}[TEST 4] Submit Enquiries${NC}"
response=$(curl -s -X POST $BASE_URL/api/enquiries/public \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student One",
    "email": "student1@test.com",
    "courseInterest": "Full Stack Development"
  }')

if echo "$response" | grep -q "Enquiry submitted successfully"; then
    ENQUIRY_ID_1=$(echo "$response" | jq -r '.enquiry.id' 2>/dev/null)
    print_test "Submit public enquiry 1" "PASS"
else
    print_test "Submit public enquiry 1" "FAIL"
fi

# ============ TEST 8: Submit Public Enquiry 2 ============
response=$(curl -s -X POST $BASE_URL/api/enquiries/public \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student Two",
    "email": "student2@test.com",
    "courseInterest": "Data Science"
  }')

if echo "$response" | grep -q "Enquiry submitted successfully"; then
    ENQUIRY_ID_2=$(echo "$response" | jq -r '.enquiry.id' 2>/dev/null)
    print_test "Submit public enquiry 2" "PASS"
else
    print_test "Submit public enquiry 2" "FAIL"
fi

# ============ TEST 9: Submit Public Enquiry 3 ============
response=$(curl -s -X POST $BASE_URL/api/enquiries/public \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student Three",
    "email": "student3@test.com",
    "courseInterest": "Machine Learning"
  }')

if echo "$response" | grep -q "Enquiry submitted successfully"; then
    ENQUIRY_ID_3=$(echo "$response" | jq -r '.enquiry.id' 2>/dev/null)
    print_test "Submit public enquiry 3" "PASS"
else
    print_test "Submit public enquiry 3" "FAIL"
fi

# ============ TEST 10: Get Public Enquiries Without Token ============
echo -e "\n${YELLOW}[TEST 5] Protected Endpoints - Authentication${NC}"
response=$(curl -s -X GET $BASE_URL/api/enquiries/public \
  -H "Content-Type: application/json")

if echo "$response" | grep -q "Not authorized, no token provided"; then
    print_test "Get public enquiries without token returns 401" "PASS"
else
    print_test "Get public enquiries without token returns 401" "FAIL"
fi

# ============ TEST 11: Get Public Enquiries With Valid Token ============
response=$(curl -s -X GET $BASE_URL/api/enquiries/public \
  -H "Authorization: Bearer $SAVED_TOKEN")

if echo "$response" | grep -q "Public enquiries retrieved successfully"; then
    PUBLIC_COUNT=$(echo "$response" | jq -r '.count' 2>/dev/null)
    print_test "Get public enquiries with valid token (count: $PUBLIC_COUNT)" "PASS"
else
    print_test "Get public enquiries with valid token" "FAIL"
fi

# ============ TEST 12: Get Private Enquiries (Should Be Empty) ============
echo -e "\n${YELLOW}[TEST 6] Lead Management - Before Claim${NC}"
response=$(curl -s -X GET $BASE_URL/api/enquiries/private \
  -H "Authorization: Bearer $SAVED_TOKEN")

if echo "$response" | grep -q "Private enquiries retrieved successfully"; then
    PRIVATE_COUNT=$(echo "$response" | jq -r '.count' 2>/dev/null)
    if [ "$PRIVATE_COUNT" == "0" ]; then
        print_test "Get private enquiries (empty at start)" "PASS"
    else
        print_test "Get private enquiries (empty at start)" "FAIL"
    fi
else
    print_test "Get private enquiries (empty at start)" "FAIL"
fi

# ============ TEST 13: Claim First Enquiry ============
echo -e "\n${YELLOW}[TEST 7] Lead Claiming - CRITICAL LOGIC${NC}"
response=$(curl -s -X PATCH $BASE_URL/api/enquiries/$ENQUIRY_ID_1/claim \
  -H "Authorization: Bearer $SAVED_TOKEN" \
  -H "Content-Type: application/json")

if echo "$response" | grep -q "Lead claimed successfully"; then
    print_test "Claim enquiry 1 successfully" "PASS"
else
    print_test "Claim enquiry 1 successfully" "FAIL"
fi

# ============ TEST 14: Claim Same Enquiry Again (CRITICAL - Should Fail 409) ============
response=$(curl -s -X PATCH $BASE_URL/api/enquiries/$ENQUIRY_ID_1/claim \
  -H "Authorization: Bearer $SAVED_TOKEN" \
  -H "Content-Type: application/json")

if echo "$response" | grep -q "This lead has already been claimed"; then
    print_test "Cannot claim already claimed enquiry - returns 409" "PASS"
else
    print_test "Cannot claim already claimed enquiry - returns 409" "FAIL"
fi

# ============ TEST 15: Get Private Enquiries (Should Have 1 Now) ============
echo -e "\n${YELLOW}[TEST 8] Lead Management - After Claim${NC}"
response=$(curl -s -X GET $BASE_URL/api/enquiries/private \
  -H "Authorization: Bearer $SAVED_TOKEN")

if echo "$response" | grep -q "Private enquiries retrieved successfully"; then
    PRIVATE_COUNT=$(echo "$response" | jq -r '.count' 2>/dev/null)
    if [ "$PRIVATE_COUNT" == "1" ]; then
        print_test "Get private enquiries (1 after claim)" "PASS"
    else
        print_test "Get private enquiries (1 after claim)" "FAIL"
    fi
else
    print_test "Get private enquiries (1 after claim)" "FAIL"
fi

# ============ TEST 16: Get Public Enquiries (Should Have 2 NOW - FIXED) ============
response=$(curl -s -X GET $BASE_URL/api/enquiries/public \
  -H "Authorization: Bearer $SAVED_TOKEN")

if echo "$response" | grep -q "Public enquiries retrieved successfully"; then
    PUBLIC_COUNT=$(echo "$response" | jq -r '.count' 2>/dev/null)
    if [ "$PUBLIC_COUNT" == "2" ]; then
        print_test "Get public enquiries (2 remaining after claim)" "PASS"
    else
        print_test "Get public enquiries (2 remaining after claim - got $PUBLIC_COUNT)" "FAIL"
    fi
else
    print_test "Get public enquiries (2 remaining after claim)" "FAIL"
fi

# ============ TEST 17: Claim with Different Counselor ============
echo -e "\n${YELLOW}[TEST 9] Multi-Counselor Lead Management${NC}"
response=$(curl -s -X PATCH $BASE_URL/api/enquiries/$ENQUIRY_ID_2/claim \
  -H "Authorization: Bearer $TOKEN2" \
  -H "Content-Type: application/json")

if echo "$response" | grep -q "Lead claimed successfully"; then
    print_test "Different counselor claims different enquiry" "PASS"
else
    print_test "Different counselor claims different enquiry" "FAIL"
fi

# ============ TEST 18: Get Private Enquiries for Counselor 2 ============
response=$(curl -s -X GET $BASE_URL/api/enquiries/private \
  -H "Authorization: Bearer $TOKEN2")

if echo "$response" | grep -q "Private enquiries retrieved successfully"; then
    PRIVATE_COUNT_2=$(echo "$response" | jq -r '.count' 2>/dev/null)
    if [ "$PRIVATE_COUNT_2" == "1" ]; then
        print_test "Counselor 2 sees only their own claimed enquiry" "PASS"
    else
        print_test "Counselor 2 sees only their own claimed enquiry" "FAIL"
    fi
else
    print_test "Counselor 2 sees only their own claimed enquiry" "FAIL"
fi

# ============ TEST 19: Invalid Enquiry ID ============
echo -e "\n${YELLOW}[TEST 10] Error Handling${NC}"
response=$(curl -s -X PATCH $BASE_URL/api/enquiries/99999/claim \
  -H "Authorization: Bearer $SAVED_TOKEN" \
  -H "Content-Type: application/json")

if echo "$response" | grep -q "Enquiry not found"; then
    print_test "Invalid enquiry ID returns 404" "PASS"
else
    print_test "Invalid enquiry ID returns 404" "FAIL"
fi

# ============ Summary ============
echo -e "\n${YELLOW}==================================${NC}"
echo -e "${YELLOW}TEST SUMMARY${NC}"
echo -e "${YELLOW}==================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
TOTAL=$((PASSED + FAILED))
echo -e "Total: $TOTAL"
echo -e "${YELLOW}==================================${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! 🎉${NC}\n"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review.${NC}\n"
    exit 1
fi
