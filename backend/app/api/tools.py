from flask import Blueprint, jsonify, request

bp = Blueprint('tools', __name__, url_prefix='/api/v1/tools')

def calculate_amortization(principal, annual_rate, term_months):
    """
    Calculates the monthly payment for a loan.
    Returns monthly payment, total interest, and total cost of the loan.
    """
    if term_months <= 0:
        return 0, 0, 0

    if annual_rate == 0:
        monthly_payment = principal / term_months
        total_interest = 0
        total_cost = principal
        return monthly_payment, total_interest, total_cost

    monthly_rate = (annual_rate / 100) / 12

    # Formula for monthly payment
    numerator = monthly_rate * ((1 + monthly_rate) ** term_months)
    denominator = ((1 + monthly_rate) ** term_months) - 1
    monthly_payment = principal * (numerator / denominator)

    total_cost_of_loan = monthly_payment * term_months
    total_interest = total_cost_of_loan - principal

    return monthly_payment, total_interest, total_cost_of_loan

@bp.route('/calculate-payment', methods=['POST'])
def calculate_payment_endpoint():
    """
    An endpoint to calculate monthly loan payments for a vehicle.
    Accepts JSON body with vehicle_price, down_payment, loan_term_months, and annual_interest_rate.
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid input: No data provided"}), 400

    required_fields = ['vehicle_price', 'down_payment', 'loan_term_months', 'annual_interest_rate']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"message": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    try:
        vehicle_price = float(data['vehicle_price'])
        down_payment = float(data['down_payment'])
        loan_term_months = int(data['loan_term_months'])
        annual_interest_rate = float(data['annual_interest_rate'])

        if vehicle_price < 0 or down_payment < 0 or loan_term_months < 0 or annual_interest_rate < 0:
             return jsonify({"message": "Negative values are not allowed for financial calculations."}), 400
        if vehicle_price < down_payment:
            return jsonify({"message": "Down payment cannot be greater than the vehicle price."}), 400
        if loan_term_months == 0 and vehicle_price > down_payment:
            return jsonify({"message": "Loan term cannot be zero if there is a balance to pay."}), 400


        principal = vehicle_price - down_payment

        if principal <= 0: # If the car is fully paid for or overpaid
             return jsonify({
                "monthly_payment": 0,
                "total_loan_amount": 0,
                "total_interest_paid": 0,
                "total_cost_of_loan": 0,
                "total_cost_of_vehicle": vehicle_price,
            })

        monthly_payment, total_interest, total_cost_of_loan = calculate_amortization(principal, annual_interest_rate, loan_term_months)

        return jsonify({
            "monthly_payment": round(monthly_payment, 2),
            "total_loan_amount": round(principal, 2),
            "total_interest_paid": round(total_interest, 2),
            "total_cost_of_loan": round(total_cost_of_loan, 2),
            "total_cost_of_vehicle": round(total_cost_of_loan + down_payment, 2),
        })

    except (ValueError, TypeError) as e:
        return jsonify({"message": "Invalid data type for one of the fields. Please use numbers.", "error": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "An error occurred during calculation.", "error": str(e)}), 500
